import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logout } from '@/app/auth/actions'
import {
    LayoutDashboard,
    Building2,
    Users,
    FileText,
    Settings,
    LogOut,
    Search,
    Bell,
    Plus,
} from 'lucide-react'

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

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Fixed Sidebar */}
            <aside className="w-72 bg-primary text-primary-foreground hidden md:flex flex-col shadow-2xl z-50">
                <div className="p-8 h-24 border-b border-white/5 flex items-center gap-4">
                    <img src="/logo.png" alt="Portaria SaaS" className="h-12 w-12" />
                    <div>
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
                            Portaria<span className="text-white/40">SaaS</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">Security System</p>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-4 overflow-y-auto mt-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center p-3 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group relative overflow-hidden"
                    >
                        <LayoutDashboard className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Visão Geral</span>
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                        href="/dashboard/empresas"
                        className="flex items-center p-3 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                        <Building2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Empresas</span>
                    </Link>
                    <Link
                        href="/dashboard/visitantes"
                        className="flex items-center p-3 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                        <Users className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Visitantes</span>
                    </Link>
                    <Link
                        href="/dashboard/relatorios"
                        className="flex items-center p-3 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                        <FileText className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">Relatórios</span>
                    </Link>

                    {isAdmin && (
                        <Link
                            href="/dashboard/configuracoes"
                            className="flex items-center p-3 text-white/70 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-300 group"
                        >
                            <Settings className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                            <span className="font-semibold text-sm">Configurações</span>
                        </Link>
                    )}
                </nav>

                <div className="p-6 border-t border-white/5">
                    <form action={logout}>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl h-12"
                        >
                            <LogOut className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                            <span className="font-bold text-xs uppercase tracking-widest">Sair da Sessão</span>
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
                {/* Fixed Top Header (Operation Center) */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex-1 max-w-xl">
                        <form action="/dashboard/visitantes" method="GET" className="relative group">
                            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Search className="h-4 w-4" />
                            </button>
                            <Input
                                name="search"
                                placeholder="Buscar por Nome ou CPF..."
                                className="pl-10 bg-slate-100/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all h-11 rounded-xl w-full"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-6 ml-8">
                        <Link href="/dashboard/visitantes?status=bloqueado" className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <Bell className="h-5 w-5 text-slate-600" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </Link>

                        <Link href="/dashboard/visitantes?action=new">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl px-5 h-11 gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Plus className="h-5 w-5" />
                                <span>Novo Registro</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    )
}
