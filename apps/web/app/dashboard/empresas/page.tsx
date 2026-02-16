import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CompanyList } from '@/components/features/empresas/company-list'
import { CompanyDialog } from '@/components/features/empresas/company-dialog'

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

    if (searchParams.status === 'ativa') {
        query = query.eq('status', 'ativa')
    } else if (searchParams.status === 'bloqueada') {
        query = query.eq('status', 'bloqueada')
    }

    // Pegar perfil do usuário para verificar role
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    // Fetch das empresas (Server Component)
    const { data: empresas, error } = await query

    if (error) {
        return <div>Erro ao carregar empresas: {error.message}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Empresas</h2>
                    {searchParams.status === 'ativa' && (
                        <p className="text-emerald-600 text-sm mt-1 font-medium bg-emerald-50 px-3 py-1 rounded-full inline-block">
                            Filtrando por Ativas
                        </p>
                    )}
                </div>
                {isAdmin && <CompanyDialog />}
            </div>

            <CompanyList data={empresas || []} isAdmin={isAdmin} />
        </div>
    )
}
