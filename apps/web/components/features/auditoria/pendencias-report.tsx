'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileWarning, Copy, Printer, CheckCircle2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { formatDate, formatDateTime } from '@/lib/utils/date'

export interface PendenciaItem {
    tipo_id: string
    nomeDocumento: string
    status: 'pendente' | 'vencido'
    dataVencimento?: string | null
}

export interface VisitantePendencia {
    id: string
    nome: string
    cpf: string
    pendencias: PendenciaItem[]
}

export interface EmpresaPendencia {
    id: string
    nome: string
    pendenciasProprias: PendenciaItem[]
    visitantesComPendencia: VisitantePendencia[]
}

export function PendenciasReport({ data }: { data: EmpresaPendencia[] }) {
    const [search, setSearch] = useState('')
    const [selectedEmpresaId, setSelectedEmpresaId] = useState('all')

    const filteredData = data.filter(empresa => {
        if (selectedEmpresaId !== 'all' && empresa.id !== selectedEmpresaId) return false
        if (search) {
            const searchLower = search.toLowerCase()
            return empresa.nome.toLowerCase().includes(searchLower) ||
                   empresa.visitantesComPendencia.some(v => v.nome.toLowerCase().includes(searchLower))
        }
        return true
    })

    const handleCopy = (empresa: EmpresaPendencia) => {
        let text = `Olá *${empresa.nome}*, verificamos em nossos sistemas que existem pendências/atualizações documentais necessárias. Solicitamos a regularização para evitar bloqueios de acesso:\n`

        if (empresa.pendenciasProprias.length > 0) {
            text += `\n*📄 Empresa (${empresa.nome}):*\n`
            empresa.pendenciasProprias.forEach(p => {
                const statusStr = p.status === 'vencido' 
                    ? `Vencido${p.dataVencimento ? ` em ${formatDate(p.dataVencimento)}` : ''}` 
                    : 'Pendente'
                text += `- ${p.nomeDocumento} (${statusStr})\n`
            })
        }

        if (empresa.visitantesComPendencia.length > 0) {
            text += `\n*👤 Colaboradores / Subcontratados:*\n`
            empresa.visitantesComPendencia.forEach(v => {
                text += `\n*${v.nome}*\n`
                v.pendencias.forEach(p => {
                    const statusStr = p.status === 'vencido' 
                        ? `Vencido${p.dataVencimento ? ` em ${formatDate(p.dataVencimento)}` : ''}` 
                        : 'Pendente'
                    text += `  - ${p.nomeDocumento} (${statusStr})\n`
                })
            })
        }

        text += `\nAgradecemos a rápida compreensão e ficamos à disposição.`

        navigator.clipboard.writeText(text).then(() => {
            toast.success('Mensagem copiada para a área de transferência!', {
                description: `Relatório de ${empresa.nome} pronto para colar.`
            })
        }).catch(() => {
            toast.error('Não foi possível copiar o texto.')
        })
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm print:hidden">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar empresa ou visitante..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={selectedEmpresaId} onValueChange={setSelectedEmpresaId}>
                        <SelectTrigger className="w-[300px]">
                            <SelectValue placeholder="Filtrar por Empresa" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                            <SelectItem value="all">Geral (Todas Inadimplentes)</SelectItem>
                            {data.map(e => (
                                <SelectItem key={e.id} value={e.id}>{e.nome}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                        <Printer className="h-4 w-4" />
                        Imprimir / PDF
                    </Button>
                </div>
            </div>

            {/* Print Header */}
            <div className="hidden print:flex mb-8 pb-4 border-b-2 border-emerald-600 justify-between items-end gap-6 w-full">
                <div className="flex items-center gap-4">
                    {/* Logomarca - usamos a imagem local */}
                    <img src="/logo-icon.png" alt="Logo Portaria SaaS" className="h-14 w-auto object-contain" />
                    <div>
                        <h1 className="text-2xl font-black text-emerald-900 uppercase tracking-tight">Relatório de Inconformidades</h1>
                        <p className="text-slate-500 font-medium mt-0.5">Gestão Documental - Portaria SaaS</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">Gerado em: {formatDateTime(new Date())}</p>
                    <p className="text-sm text-slate-500 mt-0.5 uppercase tracking-widest">{selectedEmpresaId !== 'all' ? `Filtro: ${data.find(d => d.id === selectedEmpresaId)?.nome}` : 'Visão: Geral'}</p>
                </div>
            </div>

            <div className="space-y-6">
                {filteredData.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
                        <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">Tudo em dia!</h3>
                        <p className="text-slate-500 mt-1">Nenhuma pendência documental encontrada com este filtro.</p>
                    </div>
                ) : (
                    filteredData.map(empresa => (
                        <Card key={empresa.id} className="border border-slate-200 shadow-sm overflow-hidden break-inside-avoid">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                                <div>
                                    <CardTitle className="text-lg font-bold text-slate-900">{empresa.nome}</CardTitle>
                                    <p className="text-sm text-slate-500 font-medium mt-1">
                                        Total de irregularidades: <span className="font-bold text-slate-700">{
                                            empresa.pendenciasProprias.length + 
                                            empresa.visitantesComPendencia.reduce((acc, v) => acc + v.pendencias.length, 0)
                                        }</span>
                                    </p>
                                </div>
                                <Button size="sm" onClick={() => handleCopy(empresa)} className="gap-2 print:hidden bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                                    <Copy className="h-4 w-4" />
                                    Copiar Cobrança
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {empresa.pendenciasProprias.length > 0 && (
                                        <div className="p-4 bg-white">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <FileWarning className="h-4 w-4 text-orange-500" />
                                                Documentos Próprios (Empresa)
                                            </h4>
                                            <div className="grid gap-2 pl-6">
                                                {empresa.pendenciasProprias.map((p, i) => (
                                                    <div key={i} className="flex justify-between items-center bg-slate-50 p-2 px-3 rounded-lg border border-slate-100">
                                                        <span className="text-sm font-semibold text-slate-700">{p.nomeDocumento}</span>
                                                        <Badge variant={p.status === 'vencido' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold">
                                                            {p.status === 'vencido' ? `Vencido${p.dataVencimento ? ` (${formatDate(p.dataVencimento)})` : ''}` : 'Pendente n/ Enviado'}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {empresa.visitantesComPendencia.length > 0 && (
                                        <div className="p-4 bg-white">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Colaboradores & Subcontratados Irregulares</h4>
                                            <div className="space-y-4">
                                                {empresa.visitantesComPendencia.map(v => (
                                                    <div key={v.id} className="border border-slate-100 rounded-xl p-3 bg-white">
                                                        <div className="mb-2 flex items-center justify-between border-b border-slate-50 pb-2">
                                                            <span className="font-bold text-slate-800 text-sm">{v.nome}</span>
                                                            <span className="text-xs text-slate-400 font-mono">{v.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                                                        </div>
                                                        <div className="grid gap-2">
                                                            {v.pendencias.map((p, i) => (
                                                                <div key={i} className="flex justify-between items-center">
                                                                    <span className="text-xs font-medium text-slate-600 pl-2 border-l-2 border-slate-200">{p.nomeDocumento}</span>
                                                                    <Badge variant="outline" className={`text-[10px] uppercase font-bold border-none px-2 py-0.5 ${p.status === 'vencido' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                                        {p.status === 'vencido' ? `Vencido${p.dataVencimento ? ` (${formatDate(p.dataVencimento)})` : ''}` : 'Pendente'}
                                                                    </Badge>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            
            <style jsx global>{`
                @media print {
                    @page { margin: 12mm 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: white !important; }
                    
                    /* FORÇAR DESBLOQUEIO DE MÚLTIPLAS PÁGINAS */
                    html, body, #__next, main, .h-screen, .max-h-screen, .overflow-hidden, .overflow-y-auto { 
                        height: auto !important; 
                        max-height: none !important; 
                        overflow: visible !important; 
                    }
                    
                    /* ESCONDER ELEMENTOS DE NAVEGAÇÃO / MENUS */
                    aside, nav, header, [data-sidebar], .sidebar-container { display: none !important; }
                    
                    /* LIMPAR LAYOUT PRINCIPAL */
                    main { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
                }
            `}</style>
        </div>
    )
}
