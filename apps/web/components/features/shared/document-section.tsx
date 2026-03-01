'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Upload,
    Trash2,
    Eye,
    Download,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react'
import {
    uploadDocument,
    deleteDocument,
    getDocuments,
    getDocumentTypes,
    getDocumentUrl
} from '@/app/dashboard/documentos/actions'
import { toast } from 'sonner'

interface DocumentSectionProps {
    parentId: string
    parentType: 'empresa' | 'visitante'
    entidade: 'MEI' | 'GERAL' | 'VISITANTE'
}

export function DocumentSection({ parentId, parentType, entidade }: DocumentSectionProps) {
    const [types, setTypes] = useState<any[]>([])
    const [docs, setDocs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState<string | null>(null)
    const [dates, setDates] = useState<Record<string, string>>({})

    const loadData = useCallback(async () => {
        setLoading(true)
        const [fetchedTypes, fetchedDocs] = await Promise.all([
            getDocumentTypes(entidade),
            getDocuments(parentId)
        ])
        setTypes(fetchedTypes)
        setDocs(fetchedDocs)
        setLoading(false)
    }, [parentId, entidade])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleUpload = async (tipoId: string, file: File, dataVencimento?: string) => {
        setUploading(tipoId)
        const formData = new FormData()
        formData.append('arquivo', file)
        formData.append('parentId', parentId)
        formData.append('parentType', parentType)
        formData.append('tipoId', tipoId)
        if (dataVencimento) formData.append('dataVencimento', dataVencimento)

        const res = await uploadDocument(formData)
        if (res.success) {
            toast.success(res.message)
            loadData()
        } else {
            toast.error(res.message || 'Erro ao enviar documento')
        }
        setUploading(null)
    }

    const handleDelete = async (docId: string, path: string) => {
        if (!confirm('Tem certeza que deseja remover este documento?')) return
        const res = await deleteDocument(docId, path, parentType)
        if (res.success) {
            toast.success('Documento removido')
            loadData()
        } else {
            toast.error(res.message || 'Erro ao remover documento')
        }
    }

    if (loading) return <div className="p-4 text-center">Carregando documentos...</div>

    return (
        <div className="space-y-4 py-4">
            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-3 px-1">
                    {types.map((type) => {
                        const existingDoc = docs.find(d => d.documento_nome === type.nome)

                        return (
                            <Card key={type.id} className={`transition-all duration-200 ${existingDoc ? 'border-emerald-100 bg-emerald-50/20 shadow-sm' : 'border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'}`}>
                                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${existingDoc ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="font-semibold text-sm text-slate-900 truncate">{type.nome}</p>
                                                {type.obrigatorio && !existingDoc && (
                                                    <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 h-4 text-red-500 border-red-200 bg-red-50">Obrigatório</Badge>
                                                )}
                                            </div>
                                            {existingDoc && (
                                                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[10px] font-bold px-2 h-4 ${existingDoc.status_vencimento === 'vencido' ? 'bg-red-100 text-red-700' :
                                                            existingDoc.status_vencimento === 'alerta' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-emerald-100 text-emerald-700'
                                                            }`}
                                                    >
                                                        {existingDoc.status_vencimento === 'vencido' ? 'VENCIDO' :
                                                            existingDoc.status_vencimento === 'alerta' ? 'VENCE EM BREVE' :
                                                                'VÁLIDO'}
                                                    </Badge>
                                                    {existingDoc.data_vencimento && (
                                                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Expira em: {new Date(existingDoc.data_vencimento).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 sm:ml-auto">
                                        {existingDoc ? (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-9 px-3 gap-2 text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl"
                                                    onClick={async () => {
                                                        const res = await getDocumentUrl(existingDoc.arquivo_url)
                                                        if (res.url) {
                                                            window.open(res.url, '_blank')
                                                        } else {
                                                            toast.error(res.error || 'Erro ao abrir o documento.')
                                                        }
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="hidden sm:inline">Visualizar</span>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                                    onClick={() => handleDelete(existingDoc.id, existingDoc.arquivo_url)}
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                                                {type.vencimento_tipo !== 'NENHUM' && (
                                                    <div className="flex flex-col sm:items-end gap-1">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 px-1">Vencimento</span>
                                                        <Input
                                                            type="date"
                                                            className="h-9 text-sm w-full sm:w-40 bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl"
                                                            value={dates[type.id] || ''}
                                                            onChange={(e) => {
                                                                setDates(prev => ({ ...prev, [type.id]: e.target.value }))
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col sm:items-end gap-1">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 px-1 opacity-0 hidden sm:block">Ações</span>
                                                    <Label
                                                        htmlFor={`file-${type.id}`}
                                                        className={`cursor-pointer inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 h-9 px-5 shadow-sm shadow-emerald-200 ${uploading === type.id ? 'opacity-50 pointer-events-none' : ''}`}
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        {uploading === type.id ? 'Subindo...' : 'Enviar Arquivo'}
                                                    </Label>
                                                    <input
                                                        id={`file-${type.id}`}
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,.png,.jpg,.jpeg"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0]
                                                            if (!file) return;

                                                            if (type.vencimento_tipo !== 'NENHUM' && !dates[type.id]) {
                                                                toast.info('Selecione a data de vencimento primeiro.', { duration: 3000 })
                                                                e.target.value = '' // Clear input
                                                                return;
                                                            }

                                                            handleUpload(type.id, file, dates[type.id])
                                                            e.target.value = '' // Clear input
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
                {types.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        Nenhum tipo de documento configurado para esta categoria.
                    </div>
                )}
            </div>
        </div>
    )
}
