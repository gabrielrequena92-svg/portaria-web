'use client'

import { useState } from 'react'
import { Building, MapPin, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCondominio } from '../actions'
import { toast } from 'sonner'

export function CondominioEditor({ condominio }: { condominio: any }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            await updateCondominio(formData)
            setIsEditing(false)
            toast.success('Dados do condomínio atualizados!')
        } catch (error) {
            toast.error('Erro ao atualizar dados.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={condominio?.id || ''} />

            <div className="flex justify-between items-center mb-2">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Identidade do Condomínio</h3>
                    <p className="text-sm text-slate-500">Configure as informações que identificam esta unidade.</p>
                </div>
                {!isEditing && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                        Editar Informações
                    </Button>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="nome" className="text-xs uppercase tracking-widest text-slate-400 font-black">Nome do Condomínio</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="nome"
                            name="nome"
                            defaultValue={condominio?.nome || ''}
                            disabled={!isEditing}
                            placeholder="Ex: Condomínio Solar das Palmeiras"
                            className="pl-10 rounded-xl bg-slate-50/50 focus:bg-white border-slate-100 disabled:opacity-70 disabled:cursor-not-allowed h-12"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="endereco" className="text-xs uppercase tracking-widest text-slate-400 font-black">Endereço Completo</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            id="endereco"
                            name="endereco"
                            defaultValue={condominio?.endereco || ''}
                            disabled={!isEditing}
                            placeholder="Rua, Número, Bairro, Cidade..."
                            className="pl-10 rounded-xl bg-slate-50/50 focus:bg-white border-slate-100 disabled:opacity-70 disabled:cursor-not-allowed h-12"
                            required
                        />
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 rounded-xl gap-2 h-12 px-8 flex-1 md:flex-none"
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Salvando...' : 'Salvar Dados'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="rounded-xl h-12 px-8 text-slate-500"
                    >
                        Cancelar
                    </Button>
                </div>
            )}
        </form>
    )
}
