'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileDown, 
  Trash2, 
  Building2, 
  FileSpreadsheet, 
  ArrowRight, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Tag, 
  Sparkles,
  Layers,
  GripVertical,
  History,
  Clock
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { generateOfficialPDF, ReportData, ReportPhoto } from '@/lib/pdf-generator';
import { generateOfficialExcel } from '@/lib/excel-generator';
import { createClient } from '@/lib/supabase/client';

interface ObraConfig {
  engenheiro: string;
  coordenador: string;
  codigo: string;
  endereco: string;
  logo: string | null;
  locais: string[];
}

interface HistoricoItem {
  id: string;
  created_at: string;
  obra_nome: string;
  semana_ref: string;
  tipo_arquivo: string;
  total_fotos: number;
  arquivo_nome: string;
}

const INITIAL_OBRAS: Record<string, ObraConfig> = {
  '3Z FAZENDA DA MATA': {
    engenheiro: 'Jacqueline Correia',
    coordenador: 'Guilherme Quadros',
    codigo: 'L3.0002/18',
    endereco: 'Rua Antônio Garcia, 8-48 - Bauru/SP',
    logo: null,
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
  '5Z CIDADE DAS ÁRVORES': {
    engenheiro: 'VINICIUS PERAL',
    coordenador: 'GUILHERME QUADROS',
    codigo: 'L5.0041/20',
    endereco: 'Av. das Nações Unidas - Bauru/SP',
    logo: null,
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
};

export default function RelatorioOrganizacaoWizard() {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [obrasList, setObrasList] = useState<Record<string, ObraConfig>>(INITIAL_OBRAS);
  const [selectedObraKey, setSelectedObraKey] = useState<string>('3Z FAZENDA DA MATA');

  // Supabase client
  const supabase = createClient();
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [showHistorico, setShowHistorico] = useState(false);

  // Estado do formulário da Obra
  const [reportData, setReportData] = useState<ReportData>({
    obraNome: '3Z FAZENDA DA MATA',
    obraCodigo: 'L3.0002/18',
    endereco: 'Rua Antônio Garcia, 8-48 - Bauru/SP',
    dataRef: `Semana W${getWeekNumber(new Date())} - Data: ${formatCurrentWeekRange()}`,
    engenheiro: 'Jacqueline Correia',
    coordenador: 'Guilherme Quadros',
    logoObra: null,
  });

  // Lista de tags de locais da obra atual
  const [currentLocais, setCurrentLocais] = useState<string[]>(INITIAL_OBRAS['3Z FAZENDA DA MATA'].locais);
  const [novoLocalInput, setNovoLocalInput] = useState('');

  // Fotos & Drag Reorder
  const [fotos, setFotos] = useState<ReportPhoto[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Carregar dados salvos e histórico
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gr_obras_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setObrasList(parsed);
          if (parsed[selectedObraKey]) {
            applyObra(selectedObraKey, parsed[selectedObraKey]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const { data, error } = await supabase
        .from('relatorios_historico')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (data && !error) {
        setHistorico(data as HistoricoItem[]);
      }
    } catch (e) {
      // Tabela ainda não criada no Supabase, continua normalmente
    }
  };

  const registrarHistorico = async (tipo: 'xlsx' | 'pdf', arquivoNome: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const novoRegistro = {
        user_id: user?.id || null,
        obra_nome: reportData.obraNome,
        semana_ref: reportData.dataRef,
        engenheiro: reportData.engenheiro,
        coordenador: reportData.coordenador,
        total_fotos: fotos.length,
        tipo_arquivo: tipo,
        arquivo_nome: arquivoNome
      };

      const { data } = await supabase.from('relatorios_historico').insert([novoRegistro]).select();
      if (data) {
        setHistorico(prev => [data[0] as HistoricoItem, ...prev]);
      }
    } catch (e) {
      // Ignora caso tabela não exista
    }
  };

  // Salvar no localStorage sempre que atualizar
  const saveObrasState = (updatedList: Record<string, ObraConfig>) => {
    setObrasList(updatedList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gr_obras_config', JSON.stringify(updatedList));
    }
  };

  const applyObra = (key: string, obra: ObraConfig) => {
    setSelectedObraKey(key);
    setReportData(prev => ({
      ...prev,
      obraNome: key,
      obraCodigo: obra.codigo,
      endereco: obra.endereco,
      engenheiro: obra.engenheiro,
      coordenador: obra.coordenador,
      logoObra: obra.logo
    }));
    setCurrentLocais(obra.locais || []);
  };

  const handleSelectObra = (key: string) => {
    if (key === 'NOVA') {
      setSelectedObraKey('NOVA');
      setReportData(prev => ({
        ...prev,
        obraNome: '',
        obraCodigo: '',
        endereco: '',
        engenheiro: '',
        coordenador: '',
        logoObra: null
      }));
      setCurrentLocais(['ADMINISTRATIVO', 'ALMOXARIFADO', 'CANTEIRO']);
    } else {
      const obra = obrasList[key] || INITIAL_OBRAS[key];
      applyObra(key, obra);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setReportData(prev => ({ ...prev, logoObra: logoUrl }));

      // Salva a logo na memória daquela obra
      if (selectedObraKey && selectedObraKey !== 'NOVA') {
        const updated = {
          ...obrasList,
          [selectedObraKey]: {
            ...obrasList[selectedObraKey],
            logo: logoUrl
          }
        };
        saveObrasState(updated);
      }
    }
  };

  const handleAddLocalTag = () => {
    const tag = novoLocalInput.trim().toUpperCase();
    if (tag && !currentLocais.includes(tag)) {
      const updated = [...currentLocais, tag];
      setCurrentLocais(updated);
      setNovoLocalInput('');

      if (selectedObraKey && selectedObraKey !== 'NOVA' && obrasList[selectedObraKey]) {
        const updatedObras = {
          ...obrasList,
          [selectedObraKey]: {
            ...obrasList[selectedObraKey],
            locais: updated
          }
        };
        saveObrasState(updatedObras);
      }
    }
  };

  const handleRemoveLocalTag = (tagToRemove: string) => {
    const updated = currentLocais.filter(t => t !== tagToRemove);
    setCurrentLocais(updated);
    if (selectedObraKey && selectedObraKey !== 'NOVA' && obrasList[selectedObraKey]) {
      const updatedObras = {
        ...obrasList,
        [selectedObraKey]: {
          ...obrasList[selectedObraKey],
          locais: updated
        }
      };
      saveObrasState(updatedObras);
    }
  };

  // Drag and Drop de upload de arquivos
  const onDrop = (acceptedFiles: File[]) => {
    const novas = acceptedFiles.map((file, idx) => {
      const dataUrl = URL.createObjectURL(file);
      const defaultDesc = currentLocais[(fotos.length + idx) % currentLocais.length] || '';
      return {
        id: Math.random().toString(36).substring(2, 9),
        dataUrl,
        descricao: defaultDesc,
        originalName: file.name
      };
    });
    setFotos(prev => [...prev, ...novas]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] }
  });

  // Reordenação por Arrastar e Soltar (Drag & Drop nativo suave)
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const reordered = [...fotos];
      const [movedItem] = reordered.splice(draggedIndex, 1);
      reordered.splice(dragOverIndex, 0, movedItem);
      setFotos(reordered);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Reordenação por botões de seta
  const movePhoto = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= fotos.length) return;
    const reordered = [...fotos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    setFotos(reordered);
  };

  // Gerar Excel
  const handleGenerateExcel = async () => {
    if (fotos.length === 0) {
      alert('Adicione pelo menos uma foto para gerar o relatório.');
      return;
    }
    setIsGeneratingExcel(true);
    try {
      await generateOfficialExcel(reportData, fotos);
      const cleanName = reportData.obraNome.replace(/\s+/g, '_') || 'Relatorio';
      registrarHistorico('xlsx', `Relatorio_${cleanName}.xlsx`);
    } catch (e: any) {
      alert('Erro ao gerar Excel: ' + e.message);
    } finally {
      setIsGeneratingExcel(false);
    }
  };

  // Gerar PDF
  const handleGeneratePDF = async () => {
    if (fotos.length === 0) {
      alert('Adicione pelo menos uma foto para gerar o relatório.');
      return;
    }
    setIsGeneratingPDF(true);
    try {
      await generateOfficialPDF(reportData, fotos);
      const cleanName = reportData.obraNome.replace(/\s+/g, '_') || 'Relatorio';
      registrarHistorico('pdf', `Relatorio_Fotografico_${cleanName}.pdf`);
    } catch (e: any) {
      alert('Erro ao gerar PDF: ' + e.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const totalPaginas = Math.ceil(fotos.length / 2) || 1;

  return (
    <div className="min-h-screen bg-neutral-100 p-6 md:p-10">
      
      {/* HEADER GERAL COM INDICADOR DE ETAPAS */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                Relatório de Organização & Arrumação
              </span>
              <span className="text-neutral-500 text-xs">Padrão Oficial Zopone</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 mt-1">
              {currentStep === 1 ? 'Etapa 1: Identificação da Obra' : 'Etapa 2: Carregamento das Fotos'}
            </h1>
          </div>

          {/* Stepper Visual + Botão de Histórico */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistorico(!showHistorico)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-bold transition shadow-sm ${
                showHistorico ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <History size={15} />
              Histórico ({historico.length})
            </button>

            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border shadow-sm">
              <button
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  currentStep === 1 ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
                Dados da Obra
              </button>

              <span className="text-neutral-300">→</span>

              <button
                onClick={() => {
                  if (!reportData.obraNome.trim()) {
                    alert('Preencha o nome da obra antes de avançar.');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                  currentStep === 2 ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:bg-neutral-100'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
                Fotos & Nomes ({fotos.length})
              </button>
            </div>
          </div>
        </div>

        {/* PAINEL RETRÁTIL: HISTÓRICO SUPABASE */}
        {showHistorico && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Clock className="text-emerald-600" size={18} />
                <h3 className="font-bold text-sm text-neutral-800">Últimos Relatórios Gerados (Supabase)</h3>
              </div>
              <span className="text-xs text-neutral-400">Gravados na nuvem</span>
            </div>

            {historico.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {historico.map((item) => (
                  <div key={item.id} className="p-3.5 bg-neutral-50 border rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800 truncate">{item.obra_nome}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.tipo_arquivo === 'xlsx' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.tipo_arquivo}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">{item.semana_ref}</p>
                    <div className="flex items-center justify-between pt-1 border-t text-[10px] text-neutral-400">
                      <span>{item.total_fotos} fotos</span>
                      <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-400 text-center py-4">
                Nenhum relatório registrado ainda no Supabase. Os próximos relatórios gerados aparecerão aqui automaticamente!
              </p>
            )}
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto">
        
        {/* ========================================================================= */}
        {/* ETAPA 1: IDENTIFICAÇÃO DA OBRA, LOGO E PRESETS DE LOCAIS                  */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Formulário de Identificação */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-neutral-900">Selecione ou Cadastre a Obra</h2>
                    <p className="text-xs text-neutral-500">Os dados e logo ficam salvos automaticamente na memória do sistema.</p>
                  </div>
                </div>
              </div>

              {/* Seletor de Obras */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Obra Selecionada:
                </label>
                <select
                  value={selectedObraKey}
                  onChange={(e) => handleSelectObra(e.target.value)}
                  className="w-full h-12 px-4 bg-neutral-50 border border-neutral-300 rounded-xl text-base font-bold text-neutral-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {Object.keys(obrasList).map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  <option value="NOVA">+ Cadastrar Nova Obra</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-neutral-500">Nome da Obra (Título no Cabeçalho)</label>
                  <input
                    type="text"
                    value={reportData.obraNome}
                    onChange={(e) => setReportData({ ...reportData, obraNome: e.target.value })}
                    className="w-full h-11 px-3.5 border rounded-xl text-sm font-semibold text-neutral-800"
                    placeholder="Ex: 3Z FAZENDA DA MATA"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Engenheiro Responsável</label>
                  <input
                    type="text"
                    value={reportData.engenheiro}
                    onChange={(e) => setReportData({ ...reportData, engenheiro: e.target.value })}
                    className="w-full h-11 px-3.5 border rounded-xl text-sm font-medium"
                    placeholder="Ex: Jacqueline Correia"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-500">Coordenador Responsável</label>
                  <input
                    type="text"
                    value={reportData.coordenador}
                    onChange={(e) => setReportData({ ...reportData, coordenador: e.target.value })}
                    className="w-full h-11 px-3.5 border rounded-xl text-sm font-medium"
                    placeholder="Ex: Guilherme Quadros"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-semibold text-neutral-500">Semana / Data Referência</label>
                  <input
                    type="text"
                    value={reportData.dataRef}
                    onChange={(e) => setReportData({ ...reportData, dataRef: e.target.value })}
                    className="w-full h-11 px-3.5 border rounded-xl text-sm font-medium"
                  />
                </div>
              </div>

              {/* Upload da Logo da Obra com Memória */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Logo Central da Obra (Células O2:Q6):
                  </label>
                  {reportData.logoObra && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Logo Salva na Memória
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 h-14 border-2 border-dashed rounded-xl cursor-pointer hover:bg-neutral-50 text-xs font-medium text-neutral-600 transition">
                    <ImageIcon size={18} className="text-neutral-400" />
                    <span>{reportData.logoObra ? 'Trocar Imagem da Logo' : 'Carregar Logo desta Obra'}</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {reportData.logoObra && (
                    <div className="h-14 w-24 border rounded-xl p-1 bg-white flex items-center justify-center shrink-0 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={reportData.logoObra} alt="Logo Obra" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Avanço */}
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    if (!reportData.obraNome.trim()) {
                      alert('Digite o nome da obra para continuar.');
                      return;
                    }
                    setCurrentStep(2);
                  }}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/25 transition text-sm"
                >
                  <span>Avançar para Carregar Fotos</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Painel Direito: Configuração de Presets de Locais da Obra */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Tag className="text-emerald-600" size={18} />
                  <h3 className="font-bold text-neutral-900 text-sm">
                    Presets de Locais desta Obra ({currentLocais.length})
                  </h3>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Esses nomes-chave aparecerão como botões rápidos na Etapa 2 para legendar cada foto em 1 clique.
                </p>

                {/* Adicionar novo local */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novoLocalInput}
                    onChange={(e) => setNovoLocalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLocalTag()}
                    placeholder="Novo local (ex: REFEITÓRIO)"
                    className="flex-1 h-10 px-3 border rounded-xl text-xs font-medium uppercase"
                  />
                  <button
                    onClick={handleAddLocalTag}
                    className="px-3.5 h-10 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>

                {/* Lista de tags */}
                <div className="flex flex-wrap gap-1.5 max-h-64 overflow-y-auto p-1">
                  {currentLocais.map((local) => (
                    <span
                      key={local}
                      className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-800 font-semibold px-2.5 py-1 rounded-lg border"
                    >
                      {local}
                      <button
                        onClick={() => handleRemoveLocalTag(local)}
                        className="text-neutral-400 hover:text-red-500 text-xs"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Resumo do Cabeçalho */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles size={15} /> Modelo Pronto para Fotos
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Na etapa seguinte, você pode arrastar as fotos para reordenar livremente antes de gerar a planilha oficial do Excel.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 2: CARREGAMENTO, REORDENAÇÃO (DRAG & DROP) E IDENTIFICAÇÃO           */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            
            {/* Barra Superior da Etapa 2 */}
            <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition"
                >
                  <ArrowLeft size={16} /> Voltar à Identificação
                </button>
                <div className="border-l pl-3">
                  <span className="text-xs text-neutral-400 font-semibold">Obra Ativa:</span>
                  <p className="text-sm font-bold text-neutral-800">{reportData.obraNome || 'Não informada'}</p>
                </div>
              </div>

              {/* Botões de Ação de Download */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerateExcel}
                  disabled={fotos.length === 0 || isGeneratingExcel}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition text-sm"
                >
                  {isGeneratingExcel ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileSpreadsheet size={18} />
                  )}
                  Baixar Excel Oficial (.xlsx)
                </button>

                <button
                  onClick={handleGeneratePDF}
                  disabled={fotos.length === 0 || isGeneratingPDF}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 disabled:opacity-50 transition text-sm"
                >
                  {isGeneratingPDF ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <FileDown size={18} />
                  )}
                  Baixar em PDF
                </button>
              </div>
            </div>

            {/* Dropzone de Fotos */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                isDragActive ? 'border-emerald-600 bg-emerald-50/50' : 'border-neutral-300 hover:border-emerald-500 bg-white shadow-sm'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Upload size={24} />
              </div>
              <h3 className="font-bold text-neutral-800 text-base">Arraste ou Selecione as Fotos da Vistoria</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                Selecione as fotos do seu computador ou celular. Cada 2 fotos formarão uma aba oficial na planilha.
              </p>
            </div>

            {/* Lista e Reordenação de Fotos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-neutral-900 text-sm">
                    Fotos Organizadas ({fotos.length}) - Total de {totalPaginas} Aba(s)
                  </h3>
                  {fotos.length > 1 && (
                    <span className="text-[11px] text-neutral-400 bg-neutral-200/60 px-2 py-0.5 rounded-md font-medium">
                      Dica: Clique e arraste um card para trocar de posição
                    </span>
                  )}
                </div>
                {fotos.length > 0 && (
                  <button
                    onClick={() => setFotos([])}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Remover Todas as Fotos
                  </button>
                )}
              </div>

              {/* Lista com Drag & Drop */}
              <div className="space-y-3">
                {fotos.map((foto, index) => {
                  const paginaNum = Math.floor(index / 2) + 1;
                  const isFoto1DaPagina = index % 2 === 0;
                  const isBeingDragged = draggedIndex === index;
                  const isDragTarget = dragOverIndex === index;

                  return (
                    <div
                      key={foto.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDragEnd={handleDragEnd}
                      className={`bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-start shadow-sm transition-all select-none ${
                        isBeingDragged 
                          ? 'opacity-30 border-dashed border-emerald-500 scale-[0.98]' 
                          : isDragTarget 
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20' 
                            : 'border-neutral-200 hover:shadow-md'
                      }`}
                    >
                      {/* Alça de Arraste (Grip Handle) */}
                      <div 
                        className="hidden md:flex items-center self-stretch text-neutral-300 hover:text-neutral-600 cursor-grab active:cursor-grabbing px-1"
                        title="Segure e arraste para reordenar"
                      >
                        <GripVertical size={22} />
                      </div>

                      {/* Miniatura e Badge da Foto */}
                      <div className="relative w-full md:w-40 h-32 rounded-xl overflow-hidden bg-neutral-100 border shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={foto.dataUrl} alt="Foto" className="w-full h-full object-cover pointer-events-none" />
                        <span className="absolute top-2 left-2 bg-black/85 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
                          Foto {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                          Aba P{paginaNum} ({isFoto1DaPagina ? 'Esq.' : 'Dir.'})
                        </span>
                      </div>

                      {/* Controle de Legenda e Nomes Chave */}
                      <div className="flex-1 w-full space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-neutral-700">
                            Legenda da Foto (Célula {isFoto1DaPagina ? 'B35' : 'Q35'}):
                          </label>
                          <span className="text-[11px] text-neutral-400 font-medium">Posição {index + 1} de {fotos.length}</span>
                        </div>

                        <input
                          type="text"
                          value={foto.descricao}
                          onChange={(e) => {
                            const updated = [...fotos];
                            updated[index].descricao = e.target.value;
                            setFotos(updated);
                          }}
                          placeholder="Digite ou clique em um nome chave abaixo..."
                          className="w-full h-11 px-3.5 border border-neutral-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />

                        {/* Nomes Chaves da Obra para Clique Rápido */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {currentLocais.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                const updated = [...fotos];
                                updated[index].descricao = tag;
                                setFotos(updated);
                              }}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                                foto.descricao === tag 
                                  ? 'bg-emerald-600 text-white shadow-sm' 
                                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Botões de Ordem e Exclusão */}
                      <div className="flex md:flex-col gap-1 self-end md:self-center shrink-0">
                        <button
                          onClick={() => movePhoto(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition"
                          title="Mover para cima"
                        >
                          <ArrowUp size={18} />
                        </button>

                        <button
                          onClick={() => movePhoto(index, 'down')}
                          disabled={index === fotos.length - 1}
                          className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg disabled:opacity-30 transition"
                          title="Mover para baixo"
                        >
                          <ArrowDown size={18} />
                        </button>

                        <button
                          onClick={() => setFotos(fotos.filter((f) => f.id !== foto.id))}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir foto"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {fotos.length === 0 && (
                  <div className="bg-white border rounded-3xl p-12 text-center text-neutral-400 text-sm space-y-2">
                    <p className="font-semibold text-neutral-600">Nenhuma foto adicionada nesta obra ainda.</p>
                    <p className="text-xs">Arraste fotos para o quadro acima para preencher o relatório.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// Helpers de Data
function getWeekNumber(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatCurrentWeekRange(): string {
  const now = new Date();
  const first = now.getDate() - now.getDay();
  const last = first + 6;
  const firstDay = new Date(now.setDate(first));
  const lastDay = new Date(now.setDate(last));
  return `${firstDay.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} à ${lastDay.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
}
