import { createClient } from '@/lib/supabase/server'
import { VisitorList } from '@/components/features/visitantes/visitor-list'
import { VisitorDialog } from '@/components/features/visitantes/visitor-dialog'

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
            empresa:empresas(nome),
            condominio:condominios(id)
        `)
        .order('created_at', { ascending: false })

    // 2. Apply Filters based on Search Params
    const search = searchParams.search
    const status = searchParams.status

    if (search && typeof search === 'string') {
        // Filter by name or CPF (using ILIKE for case-insensitive search)
        query = query.or(`nome.ilike.%${search}%,cpf.ilike.%${search}%`)
    }

    if (status && typeof status === 'string') {
        if (status === 'bloqueado') {
            query = query.eq('status', 'bloqueado')
        } else if (status === 'no_local') {
            // "No Local" means status is 'ativo' (checked in but not checked out)
            query = query.eq('status', 'ativo')
        }
    }

    const { data: visitantes, error } = await query

    // Fetch empresas para o select do formulário
    const { data: empresas } = await supabase
        .from('empresas')
        .select('id, nome')
        .eq('status', 'ativa')
        .order('nome')

    // Fetch tipos de visitantes
    const { data: tiposVisitantes } = await supabase
        .from('tipos_visitantes')
        .select('id, nome')
        .order('nome')

    // Pegar o condomínio do usuário logado para o QR Code e filtros
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('condominio_id')
        .eq('id', user?.id)
        .single()

    const currentCondominioId = profile?.condominio_id || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

    if (error) {
        return <div>Erro ao carregar visitantes: {error.message}</div>
    }

    const shouldOpenNew = searchParams.action === 'new'

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visitantes</h2>
                    {search && (
                        <p className="text-slate-500 text-sm mt-1">
                            Exibindo resultados para <span className="font-bold text-slate-800">"{search}"</span>
                        </p>
                    )}
                </div>
                <VisitorDialog
                    empresas={empresas || []}
                    tiposVisitantes={tiposVisitantes || []}
                    condominioId={currentCondominioId}
                />
            </div>

            <VisitorList
                data={visitantes || []}
                empresas={empresas || []}
                tiposVisitantes={tiposVisitantes || []}
                autoOpenNew={shouldOpenNew}
                condominioId={currentCondominioId}
            />
        </div>
    )
}
