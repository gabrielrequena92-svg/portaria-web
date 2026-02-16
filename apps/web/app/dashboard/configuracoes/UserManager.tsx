"use client"

import { useState } from 'react'

import { User, Shield, ShieldAlert, Mail, UserPlus, Lock, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateUserRole, createUser } from './actions'
import { toast } from 'sonner'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function UserManager({ profiles, currentUserId }: { profiles: any[], currentUserId: string }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isCreating, setIsCreating] = useState(false)

    async function handleRoleChange(userId: string, newRole: 'admin' | 'user') {
        setIsLoading(userId)
        try {
            const result = await updateUserRole(userId, newRole)
            if (result?.error) {
                toast.error(`Falha: ${result.error}`)
            } else {
                toast.success('Permissão atualizada!')
            }
        } catch (error) {
            toast.error('Erro ao atualizar permissão.')
        } finally {
            setIsLoading(null)
        }
    }

    async function handleCreateUser(formData: FormData) {
        setIsCreating(true)
        try {
            const result = await createUser(formData)
            if (result?.error) {
                toast.error(`Erro: ${result.error}`)
            } else {
                toast.success('Usuário criado com sucesso!')
                setIsCreateOpen(false)
            }
        } catch (error) {
            toast.error('Erro inesperado ao criar usuário.')
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Gestão de Equipe</h3>
                    <p className="text-sm text-slate-500">Controle quem pode acessar o painel e quais são suas permissões.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2 h-11 px-6 shadow-md shadow-primary/20">
                            <UserPlus className="h-4 w-4" />
                            Novo Usuário
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-none shadow-2xl max-w-md">
                        <form action={handleCreateUser} className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black text-slate-900">Cadastrar Usuário</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    Crie um novo acesso direto com email e senha.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-xs uppercase font-black text-slate-400">Nome Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input id="full_name" name="full_name" placeholder="Ex: João da Silva" className="pl-10 rounded-xl h-12 bg-slate-50 border-slate-100" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs uppercase font-black text-slate-400">Email (Login)</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input id="email" name="email" type="email" placeholder="email@exemplo.com" className="pl-10 rounded-xl h-12 bg-slate-50 border-slate-100" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs uppercase font-black text-slate-400">Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input id="password" name="password" type="password" placeholder="••••••••" className="pl-10 rounded-xl h-12 bg-slate-50 border-slate-100" required minLength={6} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs uppercase font-black text-slate-400">Nível de Acesso</Label>
                                    <Select name="role" defaultValue="user">
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50 border-slate-100 font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-none shadow-2xl">
                                            <SelectItem value="user" className="rounded-xl font-medium">Visualizador/Porteiro</SelectItem>
                                            <SelectItem value="admin" className="rounded-xl font-bold">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isCreating} className="w-full h-12 rounded-xl bg-primary text-white font-bold gap-2">
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Criando...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Confirmar Cadastro
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-3">
                {profiles.map((profile) => (
                    <div
                        key={profile.id}
                        className="flex flex-wrap items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all"
                    >
                        <div className="flex items-center gap-4 min-w-[200px]">
                            <div className={`p-3 rounded-full ${profile.role === 'admin' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                                {profile.role === 'admin' ? <ShieldAlert className="h-5 w-5" /> : <User className="h-5 w-5" />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 leading-none mb-1">{profile.full_name || 'Usuário sem nome'}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                    <Mail className="h-3 w-3" />
                                    <span>{profile.id === currentUserId ? 'Você (Sessão Atual)' : 'ID: ' + profile.id.substring(0, 8)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Select
                                defaultValue={profile.role}
                                disabled={isLoading === profile.id || profile.id === currentUserId}
                                onValueChange={(value: any) => handleRoleChange(profile.id, value)}
                            >
                                <SelectTrigger className="w-[140px] rounded-xl border-slate-200 bg-slate-50 font-bold text-xs uppercase tracking-wider">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    <SelectItem value="user" className="rounded-xl">Porteiro</SelectItem>
                                    <SelectItem value="admin" className="rounded-xl font-bold">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}

                {profiles.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <User className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-medium">Nenhum usuário encontrado.</p>
                    </div>
                )}
            </div>

            {profiles.some(p => p.id === currentUserId) && (
                <p className="text-[10px] text-slate-400 italic text-center mt-4">
                    * Você não pode alterar sua própria permissão para evitar perda de acesso acidental.
                </p>
            )}
        </div>
    )
}
