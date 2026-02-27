'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    Menu,
    ChevronLeft,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/auth/actions'

interface Alert {
    id: string
    nome: string
    created_at: string
}

interface DashboardLayoutClientProps {
    children: React.ReactNode
    isAdmin: boolean
    userEmail?: string
    alerts?: Alert[]
}

export function DashboardLayoutClient({ children, isAdmin, userEmail, alerts = [] }: DashboardLayoutClientProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const pathname = usePathname()

    // Fechar menu mobile ao navegar
    useEffect(() => {
        setIsMobileOpen(false)
    }, [pathname])

    const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
        const isActive = pathname === href || pathname?.startsWith(href + '/') && href !== '/dashboard'

        return (
            <Link
                href={href}
                className={cn(
                    "flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                    isActive
                        ? "bg-white/10 text-white shadow-lg shadow-black/5"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    isCollapsed ? "justify-center" : ""
                )}
                title={isCollapsed ? label : undefined}
            >
                <Icon className={cn(
                    "h-5 w-5 transition-transform",
                    isActive ? "scale-110" : "group-hover:scale-110",
                    !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                    <span className="font-semibold text-sm animate-in fade-in slide-in-from-left-2 duration-300">
                        {label}
                    </span>
                )}
                <div className={cn(
                    "absolute inset-0 bg-white/5 opacity-0 transition-opacity",
                    isActive ? "opacity-100" : "group-hover:opacity-100"
                )} />
            </Link>
        )
    }

    const SidebarContent = () => (
        <>
            <div className={cn("flex items-center gap-4 transition-all duration-300", isCollapsed ? "p-4 justify-center" : "p-8 h-24")}>
                <img src="/logo.png" alt="Portaria SaaS" className="h-10 w-10 shrink-0" />
                {!isCollapsed && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <h1 className="text-xl font-black tracking-tighter uppercase leading-none">
                            Portaria<span className="text-white/40">SaaS</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mt-1">Security System</p>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-2 custom-scrollbar">
                <NavItem href="/dashboard" icon={LayoutDashboard} label="Visão Geral" />
                <NavItem href="/dashboard/empresas" icon={Building2} label="Empresas" />
                <NavItem href="/dashboard/visitantes" icon={Users} label="Visitantes" />
                <NavItem href="/dashboard/relatorios" icon={FileText} label="Relatórios" />

                {isAdmin && (
                    <>
                        <NavItem href="/dashboard/auditoria" icon={FileText} label="Auditoria" />
                        <NavItem href="/dashboard/configuracoes" icon={Settings} label="Configurações" />
                    </>
                )}
            </nav>

            <div className={cn("p-4 border-t border-white/5", isCollapsed ? "items-center flex flex-col" : "")}>
                <form action={logout}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl h-12",
                            isCollapsed ? "justify-center px-0" : "justify-start"
                        )}
                        title={isCollapsed ? "Sair da Sessão" : undefined}
                    >
                        <LogOut className={cn("h-5 w-5 transition-transform group-hover:-translate-x-1", !isCollapsed && "mr-3")} />
                        {!isCollapsed && <span className="font-bold text-xs uppercase tracking-widest">Sair</span>}
                    </Button>
                </form>
            </div>
        </>
    )

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "bg-primary text-primary-foreground hidden md:flex flex-col shadow-2xl z-50 transition-all duration-300 ease-in-out relative",
                    isCollapsed ? "w-20" : "w-72"
                )}
            >
                <SidebarContent />

                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 bg-white text-primary rounded-full p-1 shadow-md border border-slate-100 hover:bg-slate-50 transition-transform hover:scale-110 z-50"
                >
                    {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
                </button>
            </aside>

            {/* Mobile Sidebar (Sheet) */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="p-0 w-72 bg-primary border-r-0 text-white">
                    <div className="flex flex-col h-full">
                        <SidebarContent />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-hidden">
                {/* Fixed Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Trigger */}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
                            <Menu className="h-6 w-6 text-slate-600" />
                        </Button>

                        <div className="max-w-xl w-full hidden md:block">
                            <form action="/dashboard/visitantes" method="GET" className="relative group max-w-md">
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
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 ml-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                                    <Bell className="h-5 w-5 text-slate-600" />
                                    {alerts.length > 0 && (
                                        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                    )}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-80 p-0 rounded-xl shadow-xl border-slate-100">
                                <DropdownMenuLabel className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                    <span className="font-bold text-slate-700">Notificações</span>
                                    {alerts.length > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">{alerts.length}</span>}
                                </DropdownMenuLabel>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {alerts.length > 0 ? (
                                        alerts.map((alert) => (
                                            <DropdownMenuItem key={alert.id} className="p-4 border-b border-slate-50 focus:bg-slate-50 cursor-pointer gap-3 last:border-0">
                                                <div className="h-8 w-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                                    <Bell size={14} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800">Visitante Bloqueado</p>
                                                    <p className="text-xs text-slate-500 line-clamp-1">{alert.nome}</p>
                                                    <p className="text-[10px] text-slate-400 mt-1">{new Date(alert.created_at).toLocaleDateString()} às {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-400">
                                            <p className="text-sm">Nenhuma notificação</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-2 border-t border-slate-100">
                                    <Link href="/dashboard/visitantes?status=bloqueado">
                                        <Button variant="ghost" className="w-full text-xs h-8 text-primary font-bold">
                                            Ver todos os bloqueios
                                        </Button>
                                    </Link>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/dashboard/visitantes?action=new">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl px-3 md:px-5 h-10 md:h-11 gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Plus className="h-5 w-5" />
                                <span className="hidden md:inline">Novo Registro</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Scrollable Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
                    {children}
                </div>
            </main>
        </div>
    )
}
