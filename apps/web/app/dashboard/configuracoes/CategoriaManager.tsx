'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Tags } from 'lucide-react'
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
import { upsertTipoVisitante, deleteTipoVisitante } from './actions'
import { toast } from 'sonner'

export function CategoriaManager({ tipos }: { tipos: any[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [editingTipo, setEditingTipo] = useState<any>(null)

    async function handleSubmit(formData: FormData) {
        try {
            await upsertTipoVisitante(formData)
            setIsOpen(false)
            setEditingTipo(null)
            toast.success('Categoria salva com sucesso!')
        } catch (error) {
            toast.error('Erro ao salvar categoria.')
        }
    }

    async function handleRemove(id: string) {
        if (!confirm('Tem certeza que deseja remover esta categoria?')) return

        try {
            await deleteTipoVisitante(id)
            toast.success('Categoria removida!')
        } catch (error) {
            toast.error('Erro ao remover categoria.')
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Categorias de Visitantes</h3>
                    <p className="text-sm text-slate-500">Gerencie as opções que aparecem no cadastro mobile e web.</p>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="bg-primary hover:bg-primary/90 rounded-xl gap-2"
                            onClick={() => setEditingTipo(null)}
                        >
                            <Plus className="h-4 w-4" />
                            Nova Categoria
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-none shadow-2xl">
                        <form action={handleSubmit}>
                            <DialogHeader>
                                <DialogTitle>{editingTipo ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                                <DialogDescription>
                                    Defina o nome da categoria para classificação dos visitantes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <input type="hidden" name="id" value={editingTipo?.id || ''} />
                                <div className="grid gap-2">
                                    <Label htmlFor="nome">Nome da Categoria</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        defaultValue={editingTipo?.nome || ''}
                                        placeholder="Ex: Entregador, Prestador..."
                                        className="rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="bg-primary rounded-xl w-full">
                                    Salvar Alterações
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-3">
                {tipos.map((tipo) => (
                    <div
                        key={tipo.id}
                        className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Tags className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-slate-700">{tipo.nome}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-primary rounded-lg"
                                onClick={() => {
                                    setEditingTipo(tipo)
                                    setIsOpen(true)
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-500 rounded-lg"
                                onClick={() => handleRemove(tipo.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {tipos.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <Tags className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">Nenhuma categoria cadastrada.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
