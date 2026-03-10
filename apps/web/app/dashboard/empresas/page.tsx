import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CompanyList } from '@/components/features/empresas/company-list'
import { CompanyDialog } from '@/components/features/empresas/company-dialog'
import { CompanyFilters } from '@/components/features/empresas/company-filters'
import { calcularStatusConformidade } from '@/lib/utils/conformity'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function EmpresasPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams
    const supabase = await createClient()

    let query = supabase
        .from('empresas')
        .select('*')
        .order('created_at', { ascending: false })

    // Filtros de Nível de Banco de Dados
    if (searchParams.status && searchParams.status !== 'all') {
        query = query.eq('status', searchParams.status as string)
    }

    if (searchParams.nome && typeof searchParams.nome === 'string') {
        query = query.ilike('nome', `%${searchParams.nome}%`)
    }

    // Pegar perfil do usuário para verificar role
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // 1. Fetch das empresas
    const { data: companiesRaw, error } = await query

    // 2. Fetch de todos os tipos de documentos configurados
    const { data: docTypes } = await supabase.from('documento_tipos').select('id, obrigatorio, entidade_alvo, vencimento_tipo')

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">Erro ao carregar empresas: {error.message}</div>
    }

    // 3. Fetch dos documentos para essas empresas
    const companyIds = companiesRaw?.map(c => c.id) || []
    const { data: allDocs } = await supabase
        .from('documentos')
        .select('*')
        .in('parent_id', companyIds)
        .eq('parent_type', 'empresa')

    // 4. Mapear e calcular o status real da documentação
    let empresas = companiesRaw?.map((c: any) => {
        const requiredDocs = docTypes?.filter((t: any) => t.entidade_alvo === c.tipo_empresa || t.entidade_alvo === 'TODOS') || []
        const myDocs = allDocs?.filter(d => d.parent_id === c.id) || []

        let status_geral = calcularStatusConformidade(myDocs, requiredDocs as any)

        // Se a empresa já está bloqueada, a documentação reflete o bloqueio geral
        if (c.status === 'bloqueada' || c.status === 'inativa') {
            status_geral = 'bloqueado'
        }

        return {
            ...c,
            status_geral
        }
    }) || []

    // 5. Filtro por Status de Documentação (em memória, após cálculo)
    if (searchParams.doc_status && searchParams.doc_status !== 'all') {
        empresas = empresas.filter((e: any) => e.status_geral === searchParams.doc_status)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h2>
                    <p className="text-slate-500 text-sm mt-1">Gerencie as empresas e sua conformidade documental.</p>
                </div>
                {isAdmin && <CompanyDialog />}
            </div>

            <CompanyFilters />

            <CompanyList data={empresas} isAdmin={isAdmin} />
        </div>
    )
}
