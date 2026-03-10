import { createClient } from '@/lib/supabase/server'
import { VisitorList } from '@/components/features/visitantes/visitor-list'
import { VisitorDialog } from '@/components/features/visitantes/visitor-dialog'
import { VisitorFilters } from '@/components/features/visitantes/visitor-filters'
import { calcularStatusConformidade } from '@/lib/utils/conformity'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function VisitantesPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    // 1. Base Query
    let query = supabase
        .from('visitantes')
        .select(`
            *,
            empresa:empresas(id, nome, status, tipo_empresa),
            tipo_visitante:tipos_visitantes(id, nome, exige_documentacao),
            condominio:condominios(id)
        `)
        .order('nome', { ascending: true })

    // 2. Apply Database-level Filters
    const search = searchParams.search
    const status = searchParams.status
    const empresa_id = searchParams.empresa_id

    if (search && typeof search === 'string') {
        query = query.or(`nome.ilike.%${search}%,cpf.ilike.%${search}%`)
    }

    if (status && typeof status === 'string' && status !== 'all') {
        query = query.eq('status', status)
    }

    if (empresa_id && typeof empresa_id === 'string' && empresa_id !== 'all') {
        query = query.eq('empresa_id', empresa_id)
    }

    // 3. Fetch dos visitantes
    const { data: visitantesRaw, error } = await query

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">Erro ao carregar visitantes: {(error as any).message}</div>
    }

    // 4. Fetch de todos os tipos de documentos configurados
    const { data: docTypes } = await supabase.from('documento_tipos').select('id, obrigatorio, entidade_alvo, vencimento_tipo')

    // 5. Fetch dos documentos para esses visitantes
    const visitorIds = visitantesRaw?.map(v => v.id) || []
    const { data: allDocs } = await supabase
        .from('documentos')
        .select('*')
        .in('parent_id', visitorIds)
        .eq('parent_type', 'visitante')

    // 6. Mapear e calcular o status real da documentação
    let visitantes = visitantesRaw?.map((v: any) => {
        const isMei = v.empresa?.tipo_empresa === 'MEI'
        const exigeDocs = v.tipo_visitante?.exige_documentacao ?? true // Fallback para true se não definido ainda

        // Se a categoria NÃO exige documentação, a lista de docs obrigatórios é vazia
        const requiredDocs = !exigeDocs ? [] : (docTypes?.filter((t: any) =>
            t.entidade_alvo === 'VISITANTE' ||
            t.entidade_alvo === 'TODOS' ||
            (t.entidade_alvo === 'VISITANTE_GERAL' && !isMei) ||
            (t.entidade_alvo === 'VISITANTE_MEI' && isMei)
        ) || [])

        const myDocs = allDocs?.filter(d => d.parent_id === v.id) || []

        let status_geral = calcularStatusConformidade(myDocs, requiredDocs as any)

        if (v.status === 'bloqueado') {
            status_geral = 'bloqueado'
        } else if (v.empresa?.status === 'bloqueada' || v.empresa?.status === 'inativa') {
            status_geral = 'bloqueado_empresa'
        }

        return {
            ...v,
            status_geral
        }
    }) || []

    // 7. Filtro por Status de Documentação (em memória)
    if (searchParams.doc_status && searchParams.doc_status !== 'all') {
        visitantes = visitantes.filter((v: any) => v.status_geral === searchParams.doc_status)
    }

    // Fetch todas as empresas ativas para o filtro e formulário
    const { data: allEmpresas } = await supabase
        .from('empresas')
        .select('id, nome, tipo_empresa')
        .eq('status', 'ativa')
        .order('nome')

    // Fetch tipos de visitantes
    const { data: tiposVisitantes } = await supabase
        .from('tipos_visitantes')
        .select('id, nome')
        .order('nome')

    // Pegar o condomínio do usuário logado
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('condominio_id')
        .eq('id', user?.id)
        .single()

    const currentCondominioId = profile?.condominio_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    const shouldOpenNew = searchParams.action === 'new'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Funcionários</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie os funcionários e visitantes do condomínio.</p>
                </div>
                <VisitorDialog
                    empresas={allEmpresas || []}
                    tiposVisitantes={tiposVisitantes || []}
                    condominioId={currentCondominioId}
                />
            </div>

            <VisitorFilters empresas={allEmpresas || []} />

            <VisitorList
                data={visitantes}
                empresas={allEmpresas || []}
                tiposVisitantes={tiposVisitantes || []}
                autoOpenNew={shouldOpenNew}
                condominioId={currentCondominioId}
            />
        </div>
    )
}
