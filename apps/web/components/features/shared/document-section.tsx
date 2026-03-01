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
    getDocumentTypes
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {types.map((type) => {
                        const existingDoc = docs.find(d => d.documento_nome === type.nome)

                        return (
                            <Card key={type.id} className={existingDoc ? 'border-slate-200 bg-slate-50/50' : 'border-dashed border-slate-200'}>
                                <CardContent className="p-3 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${existingDoc ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm text-slate-900">{type.nome}</p>
                                                {type.obrigatorio && !existingDoc && (
                                                    <Badge variant="outline" className="text-[10px] h-4 text-red-500 border-red-200 bg-red-50">Obrigatório</Badge>
                                                )}
                                            </div>
                                            {existingDoc && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[10px] h-4 ${existingDoc.status_vencimento === 'vencido' ? 'bg-red-100 text-red-700' :
                                                            existingDoc.status_vencimento === 'alerta' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-emerald-100 text-emerald-700'
                                                            }`}
                                                    >
                                                        {existingDoc.status_vencimento === 'vencido' ? 'Vencido' :
                                                            existingDoc.status_vencimento === 'alerta' ? 'Vence em breve' :
                                                                'Válido'}
                                                    </Badge>
                                                    {existingDoc.data_vencimento && (
                                                        <span className="text-[10px] text-slate-500">
                                                            Validade: {new Date(existingDoc.data_vencimento).toLocaleDateString('pt-BR')}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
                                        {existingDoc ? (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-slate-500 hover:bg-slate-200"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documentos/${existingDoc.arquivo_url}`, '_blank')}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(existingDoc.id, existingDoc.arquivo_url)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2 w-full">
                                                {type.vencimento_tipo !== 'NENHUM' && (
                                                    <Input
                                                        type="date"
                                                        className="h-7 text-[10px] w-full"
                                                        onChange={(e) => {
                                                            const fileInput = document.getElementById(`file-${type.id}`) as HTMLInputElement
                                                            if (fileInput?.files?.[0]) {
                                                                handleUpload(type.id, fileInput.files[0], e.target.value)
                                                            }
                                                        }}
                                                    />
                                                )}
                                                <Label
                                                    htmlFor={`file-${type.id}`}
                                                    className={`cursor-pointer inline-flex items-center justify-center rounded-md text-[11px] font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-7 px-2 ${uploading === type.id ? 'opacity-50 pointer-events-none' : ''}`}
                                                >
                                                    <Upload className="h-3 w-3 mr-1" />
                                                    {uploading === type.id ? '...' : 'Subir'}
                                                </Label>
                                                <input
                                                    id={`file-${type.id}`}
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.png,.jpg,.jpeg"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0]
                                                        if (file) {
                                                            if (type.vencimento_tipo === 'NENHUM') {
                                                                handleUpload(type.id, file)
                                                            } else {
                                                                toast.info('Defina o vencimento.')
                                                            }
                                                        }
                                                    }}
                                                />
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
