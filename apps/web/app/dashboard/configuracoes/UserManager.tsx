"use client"

import { useState } from 'react'

import { User, Shield, ShieldAlert, Mail, UserPlus, Link, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateUserRole } from './actions'
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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function UserManager({ profiles, currentUserId }: { profiles: any[], currentUserId: string }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    async function handleRoleChange(userId: string, newRole: 'admin' | 'user') {
        setIsLoading(userId)
        try {
            await updateUserRole(userId, newRole)
            toast.success('Permissão atualizada!')
        } catch (error) {
            toast.error('Erro ao atualizar permissão.')
        } finally {
            setIsLoading(null)
        }
    }

    const signUpUrl = typeof window !== 'undefined' ? `${window.location.origin}/login` : ''

    const copyToClipboard = () => {
        navigator.clipboard.writeText(signUpUrl)
        setCopied(true)
        toast.success('Link copiado!')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Gestão de Equipe</h3>
                    <p className="text-sm text-slate-500">Controle quem pode acessar o painel e quais são suas permissões.</p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90 rounded-xl gap-2">
                            <UserPlus className="h-4 w-4" />
                            Convidar Usuário
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl border-none shadow-2xl max-w-md">
                        <DialogHeader>
                            <DialogTitle>Convidar Membro</DialogTitle>
                            <DialogDescription>
                                Peça para a pessoa acessar o link abaixo e criar uma conta.
                                Depois que ela logar, ela aparecerá na sua lista para que você mude a permissão dela.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-2 mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <Link className="h-4 w-4 text-slate-400 shrink-0" />
                            <Input
                                readOnly
                                value={signUpUrl}
                                className="bg-transparent border-none focus-visible:ring-0 shadow-none text-xs font-mono"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg"
                                onClick={copyToClipboard}
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
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
