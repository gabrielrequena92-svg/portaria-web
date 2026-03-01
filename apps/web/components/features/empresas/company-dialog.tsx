'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { createOrUpdateCompany } from '@/app/dashboard/empresas/actions'
import { DocumentSection } from '../shared/document-section'

interface CompanyDialogProps {
    company?: {
        id: string
        nome: string
        cnpj: string | null
        status: 'ativa' | 'bloqueada' | 'inativa'
        tipo_empresa?: 'MEI' | 'GERAL'
    }
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

export function CompanyDialog({ company, open, onOpenChange }: CompanyDialogProps) {
    // Controle interno se não for passado props de controle externo
    const [internalOpen, setInternalOpen] = useState(false)
    const [tipoEmpresa, setTipoEmpresa] = useState<'MEI' | 'GERAL'>((company as any)?.tipo_empresa || 'GERAL')

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Empresa
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
                    <DialogDescription>
                        {company ? 'Gerencie os dados e documentos da empresa.' : 'Preencha os dados básicos da empresa.'}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="dados" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="dados">Dados Básicos</TabsTrigger>
                        <TabsTrigger value="documentos" disabled={!company}>Documentação</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dados">
                        <form action={async (formData) => {
                            const res = await createOrUpdateCompany(null, formData)
                            if (res?.success) {
                                if (!company) {
                                    setIsOpen(false)
                                }
                                toast.success(res.message)
                            } else if (res?.message) {
                                toast.error(res.message)
                            }
                        }}>
                            <input type="hidden" name="id" value={company?.id || ''} />

                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="nome" className="text-right">
                                        Nome
                                    </Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        defaultValue={company?.nome}
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="cnpj" className="text-right">
                                        CNPJ
                                    </Label>
                                    <Input
                                        id="cnpj"
                                        name="cnpj"
                                        defaultValue={company?.cnpj || ''}
                                        className="col-span-3"
                                        placeholder="Opcional"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="tipo_empresa" className="text-right">
                                        Tipo
                                    </Label>
                                    <div className="col-span-3">
                                        <Select
                                            name="tipo_empresa"
                                            defaultValue={tipoEmpresa}
                                            onValueChange={(val: 'MEI' | 'GERAL') => setTipoEmpresa(val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MEI">MEI (Microempreendedor)</SelectItem>
                                                <SelectItem value="GERAL">ME / LTDA / Geral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="status" className="text-right">
                                        Status
                                    </Label>
                                    <div className="col-span-3">
                                        <Select name="status" defaultValue={company?.status || 'ativa'}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ativa">Ativa</SelectItem>
                                                <SelectItem value="bloqueada">Bloqueada</SelectItem>
                                                <SelectItem value="inativa">Inativa</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <SubmitButton />
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="documentos">
                        {company && (
                            <DocumentSection
                                parentId={company.id}
                                parentType="empresa"
                                entidade={tipoEmpresa}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
