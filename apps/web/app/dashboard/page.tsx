import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Users, UserCheck, AlertCircle, FileText } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/utils/date'
import Link from 'next/link'

export default async function DashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ period?: string }>
}) {
    const supabase = await createClient()
    const { period = 'Dia' } = await searchParams

    // 0. Fetch Current User for Greeting
    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.email?.split('@')[0] || 'Administrador'

    // 1. Fetch Metrics
    const { count: totalEmpresas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })

    const { count: empresasAtivas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativa')

    const { count: totalVisitantes } = await supabase
        .from('visitantes')
        .select('*', { count: 'exact', head: true })

    const { count: visitantesAtivos } = await supabase
        .from('visitantes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ativo')

    // 1c. Real Occupancy Calculation (Pessoas no perímetro AGORA)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { data: occupancyRecords } = await supabase
        .from('registros')
        .select('visitante_id, tipo')
        .gte('data_registro', today.toISOString())
        .order('data_registro', { ascending: true })

    const visitorsInMap = new Map<string, string>()
    occupancyRecords?.forEach(reg => {
        visitorsInMap.set(reg.visitante_id, reg.tipo)
    })

    let totalInPerimeter = 0
    visitorsInMap.forEach((lastType) => {
        if (lastType === 'entrada') totalInPerimeter++
    })

    // 1b. Real Alerts (Blocked entities)
    const { count: blockedEmpresas } = await supabase
        .from('empresas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'bloqueada')

    const { count: blockedVisitantes } = await supabase
        .from('visitantes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'bloqueado')

    const totalAlertas = (blockedEmpresas || 0) + (blockedVisitantes || 0)
    const alertLink = (blockedVisitantes || 0) > 0
        ? "/dashboard/visitantes?status=bloqueado"
        : "/dashboard/empresas?status=bloqueada"

    // 2. Fetch Recent Registros (Acessos reais de mobile)
    const { data: recentRegistros } = await supabase
        .from('registros')
        .select('*')
        .order('data_registro', { ascending: false })
        .limit(5)

    // 2b. Fetch Fluxo Data based on Period
    let startDate = new Date()
    if (period === 'Semana') {
        startDate.setDate(startDate.getDate() - 7)
    } else if (period === 'Mês') {
        startDate.setMonth(startDate.getMonth() - 1)
    } else {
        startDate.setHours(0, 0, 0, 0)
    }

    const { data: fluxoData } = await supabase
        .from('registros')
        .select('data_registro, tipo')
        .gte('data_registro', startDate.toISOString())
        .order('data_registro', { ascending: true })

    // Process fluxo data for the wave chart (Deterministic grouping)
    const chartBars = period === 'Dia' ? 16 : (period === 'Semana' ? 7 : 15)
    const bars = Array(chartBars).fill(0).map((_, i) => ({
        value: 15, // Base decorative height
        label: ''
    }))

    if (fluxoData && fluxoData.length > 0) {
        fluxoData.forEach(reg => {
            const date = new Date(reg.data_registro)
            let index = 0
            if (period === 'Dia') {
                index = Math.max(0, Math.min(15, date.getHours() - 7))
            } else if (period === 'Semana') {
                index = date.getDay() // 0-6
            } else {
                index = Math.min(14, Math.floor(date.getDate() / 2))
            }
            bars[index].value += 20 // Increase height for each record
        })
        // Normalize peaks to 100 and ensure visual appeal
        bars.forEach(b => b.value = Math.min(100, b.value))
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* 1. Top Banner (Premium Glassmorphism Center) */}
            <div className="relative group perspective-1000">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 md:p-10 text-white shadow-[0_32px_64px_-16px_rgba(2,44,34,0.3)] transition-all duration-500 group-hover:shadow-[0_48px_80px_-20px_rgba(2,44,34,0.4)]">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-4 max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-widest uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Monitoramento em Tempo Real
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight">
                                Olá, <span className="capitalize">{userName}</span>.
                            </h2>
                            <p className="text-primary-foreground/60 text-sm md:text-base font-medium max-w-xl">
                                Atualmente existem <span className="text-white font-bold underline decoration-emerald-500/50 underline-offset-4">{totalInPerimeter} {totalInPerimeter === 1 ? 'pessoa' : 'pessoas'}</span> dentro do perímetro.
                            </p>
                        </div>

                        {/* High-Tech Security Abstract Graphics */}
                        <div className="hidden xl:block relative h-40 w-40">
                            <div className="absolute inset-0 border-[12px] border-white/5 rounded-full" />
                            <div className="absolute inset-2 border-[1px] border-dashed border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-6 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full backdrop-blur-2xl" />
                            <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-white/20" />
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-[80px]" />
                </div>
            </div>

            {/* 2. Dynamic Metric Cards (Real-time Data) */}
            <div className="grid gap-8 md:grid-cols-3">
                <Link href="/dashboard/visitantes?status=no_local" className="group">
                    <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden group hover:bg-primary transition-all duration-500 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/50 transition-colors">
                                Visitantes Cadastrados
                            </CardTitle>
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <UserCheck className="h-6 w-6 text-emerald-600 group-hover:text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="text-5xl font-black tracking-tighter group-hover:text-white transition-colors">{totalVisitantes}</div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 group-hover:text-white/60">Total desde o início</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/dashboard/empresas?status=ativa" className="group">
                    <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden group hover:bg-primary transition-all duration-500 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/50 transition-colors">
                                Empresas Ativas
                            </CardTitle>
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <Building2 className="h-6 w-6 text-blue-600 group-hover:text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="text-5xl font-black tracking-tighter group-hover:text-white transition-colors">
                                {empresasAtivas}
                            </div>
                            <p className="text-sm text-slate-500 group-hover:text-white/60 font-medium mt-2">
                                De um total de {totalEmpresas} cadastradas
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href={alertLink} className="group">
                    <Card className="h-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl overflow-hidden group hover:bg-red-600 transition-all duration-500 cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white/50 transition-colors">
                                Alertas Críticos
                            </CardTitle>
                            <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center group-hover:bg-white/10 transition-colors text-red-600 group-hover:text-white">
                                <AlertCircle className="h-6 w-6" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="text-5xl font-black tracking-tighter group-hover:text-white transition-colors">
                                {totalAlertas}
                            </div>
                            <p className="text-sm text-slate-500 group-hover:text-white/60 font-medium mt-2">
                                Bloqueios e pendências hoje
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* 3. Central Visualization (Flow Control & Recents) */}
            <div className="grid gap-8 lg:grid-cols-12">
                {/* Access Flow Chart (Wave Style) */}
                <Card className="lg:col-span-12 xl:col-span-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-8">
                    <CardHeader className="flex flex-row items-center justify-between p-0 mb-10">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">Fluxo de Acesso</CardTitle>
                            <CardDescription className="text-sm font-medium mt-1">Picos de entrada e saída por horário</CardDescription>
                        </div>
                        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                            {['Dia', 'Semana', 'Mês'].map((t) => (
                                <Link
                                    key={t}
                                    href={`/dashboard?period=${t}`}
                                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${period === t ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-primary'}`}
                                >
                                    {t}
                                </Link>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 h-[400px] relative flex flex-col">
                        {/* Premium Smooth Area Chart (Bezier) */}
                        <div className="flex-1 relative mt-10">
                            <svg className="w-full h-full" viewBox={`0 0 ${bars.length * 100} 300`} preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* Area Path */}
                                <path
                                    d={`M 0 300 ${bars.map((bar, i) => `L ${i * 100 + 50} ${300 - (bar.value * 2.5)}`).join(' ')} L ${bars.length * 100} 300 Z`}
                                    fill="url(#chartGradient)"
                                    className="transition-all duration-1000"
                                />

                                {/* Smooth Line Path */}
                                <path
                                    d={bars.reduce((acc, bar, i) => {
                                        const x = i * 100 + 50;
                                        const y = 300 - (bar.value * 2.5);
                                        if (i === 0) return `M ${x} ${y}`;
                                        const prevX = (i - 1) * 100 + 50;
                                        const prevY = 300 - (bars[i - 1].value * 2.5);
                                        return `${acc} C ${prevX + 50} ${prevY}, ${x - 50} ${y}, ${x} ${y}`;
                                    }, '')}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="5"
                                    strokeLinecap="round"
                                    className="transition-all duration-1000"
                                    filter="url(#glow)"
                                />

                                {/* Interactive Dots */}
                                {bars.map((bar, i) => (
                                    <g key={i} className="group/dot cursor-pointer">
                                        <circle cx={i * 100 + 50} cy={300 - (bar.value * 2.5)} r="12" fill="#10b981" className="opacity-0 group-hover/dot:opacity-20 transition-opacity" />
                                        <circle cx={i * 100 + 50} cy={300 - (bar.value * 2.5)} r="5" fill="white" stroke="#059669" strokeWidth="3" className="transition-all duration-1000" />
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* Dedicated X-Axis (Fixed: Outside the chart line area) */}
                        <div className="h-12 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between px-12 rounded-b-3xl">
                            {bars.map((_, i) => {
                                if (period === 'Dia' && i % 2 !== 0) return null;
                                if (period === 'Mês' && i % 4 !== 0) return null;

                                let label = '';
                                if (period === 'Dia') label = `${7 + i}h`;
                                else if (period === 'Semana') label = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'][i];
                                else label = `${i * 2 + 1}`;

                                return (
                                    <div key={i} className="text-[10px] font-black tracking-widest text-slate-400">
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-12 xl:col-span-4 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-3xl p-8">
                    <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-2xl font-black tracking-tight">Movimentações</CardTitle>
                        <Link href="/dashboard/relatorios">
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-xl px-5 h-8 gap-2 font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Ver Tudo
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                        {recentRegistros?.map((registro) => (
                            <div key={registro.id} className="flex items-center gap-5 group cursor-pointer animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="relative shrink-0">
                                    <Avatar className="h-14 w-14 ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all">
                                        <AvatarImage src={registro.visitor_photo_snapshot || ''} alt={registro.visitante_nome_snapshot} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-black text-lg">
                                            {registro.visitante_nome_snapshot?.[0] || 'V'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white shadow-sm ${registro.tipo === 'entrada' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                                        {registro.visitante_nome_snapshot}
                                    </h4>
                                    <p className="text-xs font-semibold text-slate-400 truncate uppercase tracking-wider">
                                        {registro.empresa_nome_snapshot || 'Visitante Avulso'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-900">
                                        {formatTime(registro.data_registro)}
                                    </p>
                                    <Badge variant="outline" className={`text-[9px] font-black uppercase mt-1 px-2 py-0 border-none ${registro.tipo === 'entrada' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {registro.tipo}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {(!recentRegistros || recentRegistros.length === 0) && (
                            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sem movimentações</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
