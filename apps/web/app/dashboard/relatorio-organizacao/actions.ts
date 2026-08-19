'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ObraDbRecord {
  id?: string;
  nome: string;
  codigo?: string;
  endereco?: string;
  engenheiro?: string;
  coordenador?: string;
  logo_url?: string | null;
  locais: string[];
}

export interface HistoricoDbRecord {
  id: string;
  created_at: string;
  user_id?: string | null;
  obra_nome: string;
  semana_ref: string;
  engenheiro?: string;
  coordenador?: string;
  total_fotos: number;
  tipo_arquivo: string;
  arquivo_nome: string;
  arquivo_url?: string | null;
  status?: string;
}

const DEFAULT_OBRAS: ObraDbRecord[] = [
  {
    nome: '3Z FAZENDA DA MATA',
    codigo: 'L3.0002/18',
    endereco: 'Rua Antônio Garcia, 8-48 - Bauru/SP',
    engenheiro: 'Jacqueline Correia',
    coordenador: 'Guilherme Quadros',
    logo_url: null,
    locais: [
      'ADMINISTRATIVO',
      'ALMOXARIFADO',
      'ENTRADA CANTEIRO',
      'CANTEIRO GERAL',
      'ARMAÇÃO',
      'CARPINTARIA',
      'QUÍMICOS',
      'SALA MESTRES',
      'CIMENTO',
      'MÁQUINAS',
      'MADEIRA',
      'FERRAMENTAS MANUAIS',
      'AÇO',
      'TUBOS'
    ]
  },
  {
    nome: '5Z CIDADE DAS ÁRVORES',
    codigo: 'L5.0041/20',
    endereco: 'Av. das Nações Unidas - Bauru/SP',
    engenheiro: 'VINICIUS PERAL',
    coordenador: 'GUILHERME QUADROS',
    logo_url: null,
    locais: [
      'ADMINISTRATIVO',
      'ALMOXARIFADO - EXTERNO',
      'ALMOXARIFADO - PRATELEIRA A',
      'ALMOXARIFADO - PRATELEIRA B',
      'ALMOXARIFADO - PRATELEIRA C',
      'ARMAÇÃO',
      'BANHEIROS',
      'CANTEIRO GERAL',
      'CARPINTARIA',
      'CIMENTO',
      'ENTRADA CANTEIRO',
      'FERRAMENTAS MANUAIS',
      'MADEIRA',
      'MÁQUINAS',
      'QUÍMICOS',
      'SALA MESTRES',
      'TUBOS'
    ]
  }
];

// 1. Obter todas as obras salvas no Supabase
export async function getObras(): Promise<{ success: boolean; data: ObraDbRecord[]; error?: string }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('obras_config')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      console.warn('Erro ao buscar obras do banco:', error.message);
      return { success: true, data: DEFAULT_OBRAS };
    }

    if (!data || data.length === 0) {
      // Se não houver obras no banco, tentar semear as padrões
      try {
        for (const defaultObra of DEFAULT_OBRAS) {
          await supabase.from('obras_config').upsert(defaultObra, { onConflict: 'nome' });
        }
      } catch (seedErr) {
        console.warn('Erro ao semear obras iniciais:', seedErr);
      }
      return { success: true, data: DEFAULT_OBRAS };
    }

    return { success: true, data: data as ObraDbRecord[] };
  } catch (err: any) {
    console.error('Falha geral ao buscar obras:', err);
    return { success: true, data: DEFAULT_OBRAS };
  }
}

// 2. Salvar ou Atualizar Obra no Supabase
export async function saveObra(obra: ObraDbRecord): Promise<{ success: boolean; data?: ObraDbRecord; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Normalizar dados
    const payload = {
      nome: obra.nome.trim().toUpperCase(),
      codigo: obra.codigo || '',
      endereco: obra.endereco || '',
      engenheiro: obra.engenheiro || '',
      coordenador: obra.coordenador || '',
      logo_url: obra.logo_url || null,
      locais: obra.locais || [],
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('obras_config')
      .upsert(payload, { onConflict: 'nome' })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar obra:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/relatorio-organizacao');
    return { success: true, data: data as ObraDbRecord };
  } catch (err: any) {
    console.error('Exceção ao salvar obra:', err);
    return { success: false, error: err.message || 'Erro ao salvar obra' };
  }
}

// 3. Upload de Logo da Obra para o Storage
export async function uploadLogoObra(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const file = formData.get('file') as File;
    const obraNome = formData.get('obraNome') as string || 'geral';

    if (!file || file.size === 0) {
      return { success: false, error: 'Arquivo inválido' };
    }

    const cleanName = obraNome.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const filePath = `logos/${cleanName}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload Logo Error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data: publicData } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    return { success: true, url: publicData?.publicUrl || filePath };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 4. Salvar Arquivo Gerado (Excel ou PDF) e Registrar no Histórico
export async function saveGeneratedReport(formData: FormData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const file = formData.get('file') as File;
    const obraNome = formData.get('obraNome') as string;
    const semanaRef = formData.get('semanaRef') as string;
    const engenheiro = formData.get('engenheiro') as string;
    const coordenador = formData.get('coordenador') as string;
    const totalFotos = parseInt(formData.get('totalFotos') as string, 10) || 0;
    const arquivoNome = formData.get('arquivoNome') as string;
    const tipoArquivo = (formData.get('tipoArquivo') as string) || (arquivoNome.endsWith('.pdf') ? 'pdf' : 'xlsx');

    const { data: { user } } = await supabase.auth.getUser();

    let arquivoUrl: string | null = null;

    if (file && file.size > 0) {
      const cleanObra = (obraNome || 'relatorio').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const storagePath = `relatorios_organizacao/${cleanObra}_${Date.now()}_${arquivoNome.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

      const contentType = tipoArquivo === 'pdf' 
        ? 'application/pdf' 
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(storagePath, file, {
          upsert: true,
          contentType: contentType
        });

      if (!uploadError) {
        const { data: publicData } = supabase.storage
          .from('documentos')
          .getPublicUrl(storagePath);

        arquivoUrl = publicData?.publicUrl || storagePath;
      } else {
        console.warn('Storage upload error for report file:', uploadError.message);
      }
    }

    const { data, error } = await supabase
      .from('relatorios_historico')
      .insert([
        {
          user_id: user?.id || null,
          obra_nome: obraNome,
          semana_ref: semanaRef,
          engenheiro: engenheiro,
          coordenador: coordenador,
          total_fotos: totalFotos,
          tipo_arquivo: tipoArquivo,
          arquivo_nome: arquivoNome,
          arquivo_url: arquivoUrl,
          status: 'gerado'
        }
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Erro ao registrar histórico no banco:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/relatorio-organizacao/historico');
    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Erro ao salvar relatório gerado:', err);
    return { success: false, error: err.message };
  }
}


// 5. Buscar Histórico de Relatórios
export async function getHistoricoRelatorios(obraNomeFiltro?: string): Promise<{ success: boolean; data: HistoricoDbRecord[]; error?: string }> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('relatorios_historico')
      .select('*')
      .order('created_at', { ascending: false });

    if (obraNomeFiltro && obraNomeFiltro !== 'TODAS') {
      query = query.eq('obra_nome', obraNomeFiltro);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar histórico:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: (data || []) as HistoricoDbRecord[] };
  } catch (err: any) {
    return { success: false, data: [], error: err.message };
  }
}
