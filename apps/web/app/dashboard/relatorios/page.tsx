import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, ArrowLeft, Download, Search, Filter, User, Building2, Clock } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

import { ExportPdfButton } from '@/components/export-pdf-button'
import { RelatoriosFilter } from '@/components/relatorios-filter'
import { formatDate, formatTime } from '@/lib/utils/date'

export default async function RelatoriosPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const params = await searchParams
    const dataInicio = params.data_inicio as string
    const dataFim = params.data_fim as string
    const tipo = params.tipo as string

    // 1. Fetch Registros with Snapshots
    let query = supabase
        .from('registros')
        .select('*')
        .order('data_registro', { ascending: false })

    // Optional filtering
    if (tipo && tipo !== 'todos') {
        query = query.eq('tipo', tipo)
    }

    if (dataInicio) {
        // Appending time and Timezone (-03:00 for Brazil) to ensure correct instant comparison
        query = query.gte('data_registro', `${dataInicio}T00:00:00-03:00`)
    }

    if (dataFim) {
        // Appending time and Timezone (-03:00 for Brazil)
        query = query.lte('data_registro', `${dataFim}T23:59:59.999-03:00`)
    }

    const { data: registros, error } = await query.limit(100)

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section with glassmorphism */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Relatórios de Acesso</h2>
                        <p className="text-slate-500 font-medium">Histórico completo de entradas e saídas do condomínio.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ExportPdfButton data={registros || []} />
                    <RelatoriosFilter />
                </div>
            </div>

            {/* Main Content: Registry Table */}
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">Movimentações Recentes</CardTitle>
                            <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Registros sincronizados via Mobile</CardDescription>
                        </div>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou CPF..."
                                className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-[300px] shadow-sm"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-[80px]">Foto</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Visitante / Status</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Empresa</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest w-[160px]">Veículo</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Tipo</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Data / Horário</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {registros?.map((registro) => {
                                // Status Snapshot handling
                                const statusLabel = registro.status_snapshot?.toUpperCase() || '-';
                                const isBlocked = statusLabel === 'BLOQUEADO';

                                return (
                                    <tr key={registro.id} className="group hover:bg-slate-50/80 transition-all">
                                        <td className="px-6 py-4">
                                            <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform">
                                                <AvatarImage src={registro.visitor_photo_snapshot || ''} className="object-cover" />
                                                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                    {registro.visitante_nome_snapshot?.[0] || 'V'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <div className="text-base font-bold text-slate-900 leading-tight">
                                                    {registro.visitante_nome_snapshot}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">
                                                        CPF: {registro.visitante_cpf_snapshot || '-'}
                                                    </span>
                                                    {registro.status_snapshot && (
                                                        <Badge variant="outline" className={`text-[10px] h-5 px-2 border-0 ${isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                            {statusLabel}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-bold text-slate-600">
                                                    {registro.empresa_nome_snapshot || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {registro.placa_veiculo ? (
                                                <div className="flex items-center gap-3">
                                                    {registro.foto_veiculo_url ? (
                                                        <div className="h-10 w-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm group/car relative">
                                                            {/* Thumbnail */}
                                                            <img
                                                                src={registro.foto_veiculo_url}
                                                                alt="Veículo"
                                                                className="h-full w-full object-cover transform transition-transform group-hover/car:scale-110"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                                            <Building2 className="h-5 w-5" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-800 uppercase tracking-wider font-mono">
                                                            {registro.placa_veiculo}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Placa</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-medium italic">Sem veículo</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge
                                                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${registro.tipo === 'entrada'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                    }`}
                                            >
                                                {registro.tipo}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-slate-900">
                                                    {formatDate(registro.data_registro)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(registro.data_registro)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {(!registros || registros.length === 0) && (
                        <div className="py-40 text-center bg-slate-50/30">
                            <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <FileText className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Nenhum registro encontrado</h3>
                            <p className="text-slate-400 font-medium mt-2">Os acessos disparados pelo App aparecerão aqui.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    )
}
