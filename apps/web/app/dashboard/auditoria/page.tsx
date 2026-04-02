import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, User, Database, Clock, ArrowLeft, FileText, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils/date'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PendenciasReport, EmpresaPendencia, VisitantePendencia, PendenciaItem } from '@/components/features/auditoria/pendencias-report'

export default async function AuditoriaPage() {
    const supabase = await createClient()

    // --- LOGS FETCH ---
    const { data: logs, error: logsError } = await supabase
        .from('audit_logs')
        .select(`
            *,
            profiles:user_id (
                email
            )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

    // --- PENDÊNCIAS FETCH ---
    // Fazemos requests em parelelo para não travar o carregamento
    const [
        { data: empresasRaw },
        { data: visitantesRaw },
        { data: documentosRaw },
        { data: tiposDocumentoRaw }
    ] = await Promise.all([
        supabase.from('empresas').select('id, nome, tipo_empresa').eq('status', 'ativa'),
        supabase.from('visitantes').select('id, nome, cpf, empresa_id, subcontratada_empresa_id, tipo_visitante:tipos_visitantes(exige_documentacao)').eq('status', 'ativo'),
        supabase.from('documentos').select('id, parent_id, parent_type, tipo_id, data_vencimento'),
        supabase.from('documento_tipos').select('id, nome, obrigatorio, entidade_alvo')
    ])

    const empresas = empresasRaw || []
    const visitantes = visitantesRaw || []
    const documentos = documentosRaw || []
    const tiposDocs = tiposDocumentoRaw || []

    // Helper p/ calcular documentos pendentes ou vencidos para um alvo e sua entidade (Empresa ou Visitante)
    const getInconformidades = (
        parentId: string,
        parentType: 'empresa' | 'visitante',
        tipoEntidade?: 'MEI' | 'GERAL',
        exigeDocsVisitante: boolean = true
    ): PendenciaItem[] => {
        if (parentType === 'visitante' && !exigeDocsVisitante) return []

        // Filtra tipos obrigatorios para esta entidade
        const tiposRequeridos = tiposDocs.filter(t => {
            if (!t.obrigatorio) return false
            if (t.entidade_alvo === 'TODOS') return true
            if (parentType === 'empresa' && t.entidade_alvo === tipoEntidade) return true
            if (parentType === 'visitante') {
                if (t.entidade_alvo === 'VISITANTE') return true
                if (tipoEntidade === 'MEI' && t.entidade_alvo === 'VISITANTE_MEI') return true
                if (tipoEntidade === 'GERAL' && t.entidade_alvo === 'VISITANTE_GERAL') return true
            }
            return false
        })

        const meusDocs = documentos.filter(d => d.parent_id === parentId && d.parent_type === parentType)
        const pendencias: PendenciaItem[] = []

        // Verifica obrigatoriedade (Pendente)
        tiposRequeridos.forEach(tipo => {
            const enviado = meusDocs.find(d => d.tipo_id === tipo.id)
            if (!enviado) {
                pendencias.push({
                    tipo_id: tipo.id,
                    nomeDocumento: tipo.nome,
                    status: 'pendente'
                })
            }
        })

        // Verifica validade dos que foram enviados (Vencido)
        meusDocs.forEach(doc => {
            if (doc.data_vencimento) {
                const dataVenc = new Date(doc.data_vencimento)
                const hoje = new Date()
                hoje.setHours(0, 0, 0, 0)
                if (dataVenc.getTime() < hoje.getTime()) {
                    const tipoObj = tiposDocs.find(t => t.id === doc.tipo_id)
                    // Se não estiver na lista já como pendente
                    if (!pendencias.find(p => p.tipo_id === doc.tipo_id)) {
                        pendencias.push({
                            tipo_id: doc.tipo_id,
                            nomeDocumento: tipoObj?.nome || 'Documento',
                            status: 'vencido',
                            dataVencimento: doc.data_vencimento
                        })
                    }
                }
            }
        })

        return pendencias
    }

    // Estruturando o Agrupamento Final para a View
    const relatorioPendencias: EmpresaPendencia[] = empresas.map(emp => {
        const pendenciasProprias = getInconformidades(emp.id, 'empresa', emp.tipo_empresa as 'MEI'|'GERAL')
        
        // Pega todos os visitantes que são destas empresas diretas ou subcontratadas
        const visitantesDaEmpresa = visitantes.filter(v => v.empresa_id === emp.id || v.subcontratada_empresa_id === emp.id)
        
        const visitantesComPendencia: VisitantePendencia[] = visitantesDaEmpresa.reduce((acc: VisitantePendencia[], visit: any) => {
            // O tipo de documentação do visitante depende se ele é MEI ou GERAL.
            // Verificamos tanto a empresa principal quanto a subcontratada vinculada ao visitante.
            const empVinculada = empresas.find(e => e.id === visit.empresa_id)
            const subVinculada = empresas.find(e => e.id === visit.subcontratada_empresa_id)
            const visitorIsMei = empVinculada?.tipo_empresa === 'MEI' || subVinculada?.tipo_empresa === 'MEI'

            const pendenciasVisit = getInconformidades(
                visit.id, 
                'visitante', 
                (visitorIsMei ? 'MEI' : 'GERAL'), 
                visit.tipo_visitante?.exige_documentacao
            )
            
            if (pendenciasVisit.length > 0) {
                acc.push({
                    id: visit.id,
                    nome: visit.nome,
                    cpf: visit.cpf,
                    pendencias: pendenciasVisit
                })
            }
            return acc
        }, [])

        return {
            id: emp.id,
            nome: emp.nome,
            pendenciasProprias,
            visitantesComPendencia
        }
    }).filter(emp => emp.pendenciasProprias.length > 0 || emp.visitantesComPendencia.length > 0)


    return (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section (ocultar na impressão do PDF) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white shadow-sm print:hidden">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="rounded-2xl h-12 w-12 border-slate-200 hover:bg-primary hover:text-white transition-all shadow-sm">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900">Auditoria & Relatórios</h2>
                        <p className="text-slate-500 font-medium">Monitore logs e relatórios de conformidade.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="pendencias" className="w-full">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8 bg-slate-100 rounded-2xl p-1 border border-slate-200 h-14 print:hidden">
                    <TabsTrigger value="pendencias" className="rounded-xl font-bold gap-2">
                        <FileText className="h-4 w-4" />
                        Pendências
                    </TabsTrigger>
                    <TabsTrigger value="logs" className="rounded-xl font-bold gap-2">
                        <History className="h-4 w-4" />
                        Trilha de Ações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pendencias" className="mt-0">
                    <PendenciasReport data={relatorioPendencias} />
                </TabsContent>

                <TabsContent value="logs" className="mt-0 print:hidden">
                    {/* Logs Table */}
                    <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] bg-white rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-2xl font-black tracking-tight">Logs do Sistema</CardTitle>
                            <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Histórico de ações no painel</CardDescription>
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
                </TabsContent>
            </Tabs>
        </div>
    )
}

