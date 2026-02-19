import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayoutClient } from '@/components/layout/dashboard-layout-client'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Buscar perfil para verificar role
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error('Erro ao buscar perfil:', profileError)
    }

    const isAdmin = profile?.role === 'admin'

    // Fetch alerts (blocked visitors)
    const { data: recentAlerts } = await supabase
        .from('visitantes')
        .select('id, nome, created_at')
        .eq('status', 'bloqueado')
        .order('created_at', { ascending: false })
        .limit(5)

    return (
        <DashboardLayoutClient isAdmin={isAdmin} userEmail={user.email} alerts={recentAlerts || []}>
            {children}
        </DashboardLayoutClient>
    )
}
