import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, User, Database, Clock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils/date'

export default async function AuditoriaPage() {
    const supabase = await createClient()

    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            profiles:user_id (
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Trilha de Auditoria</h2>
                        <p className="text-slate-500 font-medium">Monitore todas as alterações realizadas no painel administrativo.</p>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                    <CardTitle className="text-2xl font-black tracking-tight">Logs do Sistema</CardTitle>
                    <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Histórico de ações (INSERT, UPDATE, DELETE)</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Ação</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Tabela / Registro</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Mudanças</th>
                                    <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Data / Hora</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs?.map((log) => (
                                    <tr key={log.id} className="group hover:bg-slate-50/80 transition-all">
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                    <User size={18} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 truncate max-w-[150px]">
                                                    {log.profiles?.email || 'Sistema/Trigger'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-mono text-xs">
                                            <Badge
                                                className={`px-3 py-1 rounded-full font-black uppercase tracking-tighter border-none shadow-sm ${log.action === 'INSERT' ? 'bg-emerald-100 text-emerald-700' :
                                                        log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                                                    <Database size={14} className="text-slate-400" />
                                                    {log.table_name}
                                                </div>
                                                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">
                                                    ID: {log.record_id?.split('-')[0]}...
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="max-w-[400px]">
                                                {log.action === 'UPDATE' ? (
                                                    <div className="text-xs space-y-1">
                                                        {Object.keys(log.new_data || {}).map(key => {
                                                            if (JSON.stringify(log.old_data?.[key]) !== JSON.stringify(log.new_data?.[key])) {
                                                                return (
                                                                    <p key={key} className="text-slate-500 font-medium truncate">
                                                                        <span className="text-slate-900 font-black uppercase text-[10px] mr-1">{key}:</span>
                                                                        {JSON.stringify(log.old_data?.[key])} → {JSON.stringify(log.new_data?.[key])}
                                                                    </p>
                                                                )
                                                            }
                                                            return null
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-medium italic italic truncate block">
                                                        Dados: {JSON.stringify(log.new_data || log.old_data || {}).substring(0, 50)}...
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="text-sm font-black text-slate-900">
                                                    {formatDate(log.created_at)}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(log.created_at)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {(!logs || logs.length === 0) && (
                        <div className="py-40 text-center bg-slate-50/30">
                            <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <History className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">Nenhuma atividade registrada</h3>
                            <p className="text-slate-400 font-medium mt-2">Alterações feitas no painel aparecerão aqui.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
