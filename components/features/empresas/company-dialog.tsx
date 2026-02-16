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
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { createOrUpdateCompany } from '@/app/dashboard/empresas/actions'
import { useFormStatus } from 'react-dom'

interface CompanyDialogProps {
    company?: {
        id: string
        nome: string
        cnpj: string | null
        status: 'ativa' | 'bloqueada' | 'inativa'
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
                    <DialogDescription>
                        Preencha os dados da empresa visitante.
                    </DialogDescription>
                </DialogHeader>

                <form action={async (formData) => {
                    const res = await createOrUpdateCompany(null, formData)
                    if (res?.success) {
                        setIsOpen(false)
                    } else if (res?.message) {
                        alert(res.message) // MVP Simples
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
            </DialogContent>
        </Dialog>
    )
}
