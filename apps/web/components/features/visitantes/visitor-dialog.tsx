'use client'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, User, Upload, Download, Share2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { createOrUpdateVisitor } from '@/app/dashboard/visitantes/actions'
import { useFormStatus } from 'react-dom'
import { QRCodeSVG } from 'qrcode.react'

interface VisitorDialogProps {
    visitor?: {
        id: string
        nome: string
        cpf: string
        foto_url: string | null
        status: 'ativo' | 'bloqueado' | 'inativo'
        empresa_id?: string | null
    }
    empresas: { id: string; nome: string }[]
    tiposVisitantes: { id: string; nome: string }[]
    condominioId?: string
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending}>
            {pending ? 'Salvando...' : 'Salvar'}
        </Button>
    )
}

export function VisitorDialog({ visitor, empresas, tiposVisitantes, condominioId, open, onOpenChange }: VisitorDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(visitor?.foto_url || null)
    const [registeredId, setRegisteredId] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
    const [generalError, setGeneralError] = useState<string | null>(null)

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = (open: boolean) => {
        if (isControlled) {
            onOpenChange!(open)
        } else {
            setInternalOpen(open)
        }
        if (!open) {
            // Reset state when closing
            setTimeout(() => {
                setRegisteredId(null)
                setFieldErrors({})
                setGeneralError(null)
            }, 300)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Visitante
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{visitor ? 'Editar Visitante' : 'Novo Visitante'}</DialogTitle>
                    <DialogDescription>
                        Cadastre os dados e foto do visitante.
                    </DialogDescription>
                </DialogHeader>

                {registeredId ? (
                    <div className="flex flex-col items-center gap-6 py-8 animate-in zoom-in-95 duration-300">
                        <div className="h-20 w-20 rounded-full bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-2xl font-bold text-slate-900">Visitante Cadastrado!</h3>
                            <p className="text-slate-500">O acesso via QR Code já está disponível.</p>
                        </div>

                        <div className="p-4 bg-white rounded-3xl border-4 border-slate-50 shadow-xl">
                            <QRCodeSVG
                                id="qr-code-visitor"
                                value={JSON.stringify({
                                    v: 'v1',
                                    id: registeredId,
                                    c: condominioId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
                                })}
                                size={200}
                                level="H"
                                includeMargin
                                imageSettings={{
                                    src: "/logo-icon.png", // Assuming there is a logo
                                    x: undefined,
                                    y: undefined,
                                    height: 40,
                                    width: 40,
                                    excavate: true,
                                }}
                            />
                        </div>

                        <div className="flex flex-col w-full gap-3 mt-4">
                            <Button
                                onClick={() => {
                                    const svg = document.getElementById('qr-code-visitor');
                                    if (svg) {
                                        const svgData = new XMLSerializer().serializeToString(svg);
                                        const canvas = document.createElement("canvas");
                                        const ctx = canvas.getContext("2d");
                                        const img = new Image();
                                        img.onload = () => {
                                            canvas.width = img.width;
                                            canvas.height = img.height;
                                            ctx?.drawImage(img, 0, 0);
                                            const pngFile = canvas.toDataURL("image/png");
                                            const downloadLink = document.createElement("a");
                                            downloadLink.download = `QR-Code-Visitante.png`;
                                            downloadLink.href = `${pngFile}`;
                                            downloadLink.click();
                                        };
                                        img.src = "data:image/svg+xml;base64," + btoa(svgData);
                                    }
                                }}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl h-12 gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Baixar QR Code
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="w-full border-slate-200 rounded-2xl h-12"
                            >
                                Concluir
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form action={async (formData) => {
                        setFieldErrors({})
                        setGeneralError(null)
                        const res = await createOrUpdateVisitor(null, formData)
                        if (res?.success) {
                            if (res.visitorId && !visitor) { // Only show for NEW visitors
                                setRegisteredId(res.visitorId)
                            } else {
                                setIsOpen(false)
                            }
                        } else {
                            if (res?.errors) {
                                setFieldErrors(res.errors)
                            }
                            if (res?.message) {
                                setGeneralError(res.message)
                            }
                        }
                    }}>
                        <input type="hidden" name="id" value={visitor?.id || ''} />

                        <div className="grid gap-6 py-4">
                            {/* Seção da Foto */}
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={previewUrl || ''} />
                                    <AvatarFallback>
                                        <User className="h-12 w-12 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="foto" className="cursor-pointer">
                                        <div className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                                            <Upload className="h-4 w-4" />
                                            Escolher Foto
                                        </div>
                                        <Input
                                            id="foto"
                                            name="foto"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </Label>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nome" className={fieldErrors.nome ? 'text-red-500' : ''}>Nome Completo</Label>
                                <Input
                                    id="nome"
                                    name="nome"
                                    defaultValue={visitor?.nome}
                                    required
                                    placeholder="Ex: João da Silva"
                                    className={fieldErrors.nome ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                />
                                {fieldErrors.nome && (
                                    <p className="text-xs text-red-500">{fieldErrors.nome[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="cpf" className={fieldErrors.cpf ? 'text-red-500' : ''}>CPF (somente números)</Label>
                                    <Input
                                        id="cpf"
                                        name="cpf"
                                        defaultValue={visitor?.cpf}
                                        required
                                        placeholder="12345678900"
                                        maxLength={11}
                                        className={fieldErrors.cpf ? 'border-red-500 focus-visible:ring-red-500' : ''}
                                    />
                                    {fieldErrors.cpf && (
                                        <p className="text-xs text-red-500">{fieldErrors.cpf[0]}</p>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select name="status" defaultValue={visitor?.status || 'ativo'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="bloqueado">Bloqueado</SelectItem>
                                            <SelectItem value="inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tipo_visitante_id">Categoria</Label>
                                    <Select name="tipo_visitante_id" defaultValue={visitor?.id ? 'existing' : tiposVisitantes[0]?.id}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {tiposVisitantes.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="empresa_id">Empresa (Opcional)</Label>
                                    <Select name="empresa_id" defaultValue={visitor?.empresa_id || 'none'}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Nenhuma</SelectItem>
                                            {empresas.map(emp => (
                                                <SelectItem key={emp.id} value={emp.id}>
                                                    {emp.nome}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Informações do Veículo (Opcional)</p>
                                <div className="grid gap-2">
                                    <Label htmlFor="placa_veiculo">Placa do Veículo</Label>
                                    <Input
                                        id="placa_veiculo"
                                        name="placa_veiculo"
                                        placeholder="ABC-1234"
                                    />
                                </div>
                            </div>
                        </div>

                        {generalError && !Object.keys(fieldErrors).length && (
                            <p className="text-sm text-red-500 text-center">{generalError}</p>
                        )}

                        <DialogFooter>
                            <SubmitButton />
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
