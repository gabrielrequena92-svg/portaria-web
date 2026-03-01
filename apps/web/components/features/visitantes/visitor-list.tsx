'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VisitorBadgeDialog } from './visitor-badge-dialog'
import { VisitorDialog } from './visitor-dialog' // Fixed missing import
import { useEffect, useState } from 'react' // Fixed missing imports

interface Visitor {
    id: string
    nome: string
    cpf: string
    foto_url: string | null
    status: 'ativo' | 'bloqueado' | 'inativo'
    empresa?: { nome: string } | null
    empresa_id?: string | null
    tipo_visitante?: { nome: string } | null
    tipo_visitante_id?: string | null
    condominio_id: string
    condominio?: { id: string }
    status_geral?: 'valido' | 'alerta' | 'vencido'
}

interface CompanyOption {
    id: string
    nome: string
}

export function VisitorList({ data, empresas, tiposVisitantes, condominioId, autoOpenNew = false }: { data: Visitor[], empresas: CompanyOption[], tiposVisitantes: { id: string, nome: string }[], condominioId?: string, autoOpenNew?: boolean }) {
    const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null)
    const [badgeVisitor, setBadgeVisitor] = useState<Visitor | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isBadgeOpen, setIsBadgeOpen] = useState(false)

    useEffect(() => {
        if (autoOpenNew) {
            setEditingVisitor(null) // Ensure we are in "create" mode
            setIsDialogOpen(true)
        }
    }, [autoOpenNew])

    const handleEdit = (visitor: Visitor) => {
        setEditingVisitor(visitor)
        setIsDialogOpen(true)
    }

    const handleBadge = (visitor: Visitor) => {
        // Ensure condominio_id is available either directly or via relation
        const visitorWithCondo = {
            ...visitor,
            condominio_id: visitor.condominio_id || visitor.condominio?.id || ''
        }
        setBadgeVisitor(visitorWithCondo)
        setIsBadgeOpen(true)
    }

    return (
        <>
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                            <TableHead className="w-[80px] pl-8 py-4"></TableHead>
                            <TableHead className="w-[200px] text-xs font-bold uppercase tracking-wider text-slate-500">Nome</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">CPF</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Empresa/Categoria</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Documentação</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                            {/* Admin actions column already handled below */}
                            <TableHead className="w-[100px] text-end pr-8">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((visitor) => (
                            <TableRow key={visitor.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="pl-8 py-3">
                                    <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform">
                                        <AvatarImage src={visitor.foto_url || ''} alt={visitor.nome} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                            {visitor.nome.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-semibold text-slate-900">{visitor.nome}</TableCell>
                                <TableCell className="text-slate-500 font-mono text-xs">{visitor.cpf}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-slate-600 font-medium text-sm">
                                            {visitor.empresa?.nome || <span className="text-slate-400 italic text-xs">Sem empresa</span>}
                                        </span>
                                        <span className="text-slate-400 text-xs">
                                            {visitor.tipo_visitante?.nome || 'Visitante'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            visitor.status_geral === 'valido'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : visitor.status_geral === 'vencido'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : visitor.status_geral === 'alerta'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-100'
                                                        : 'bg-slate-50 text-slate-500 border-slate-100'
                                        }
                                    >
                                        {visitor.status_geral === 'valido' ? 'Em dia' :
                                            visitor.status_geral === 'vencido' ? 'Documento Vencido' :
                                                visitor.status_geral === 'alerta' ? 'Vencendo em breve' :
                                                    'Sem documentos'}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            visitor.status === 'ativo'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                : visitor.status === 'bloqueado'
                                                    ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                        }
                                    >
                                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${visitor.status === 'ativo' ? 'bg-emerald-500' :
                                            visitor.status === 'bloqueado' ? 'bg-red-500' :
                                                'bg-slate-400'
                                            }`} />
                                        {visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-end pr-6">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-primary hover:bg-primary/5">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-100 p-2 w-56">
                                            <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest px-2">Ações</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(visitor)}
                                                className="rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary font-medium"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar Visitante
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleBadge(visitor)}
                                                className="rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary font-medium"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="mr-2 h-4 w-4"
                                                >
                                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                                                    <path d="M7 7h3v3H7z" />
                                                    <path d="M14 7h3v3h-3z" />
                                                    <path d="M7 14h3v3H7z" />
                                                    <path d="M14 14h3v3h-3z" />
                                                </svg>
                                                Gerar QR Code / Crachá
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Remove conditional check so dialog can open for "New" (visitor=null) */}
            <VisitorDialog
                visitor={editingVisitor || undefined}
                empresas={empresas}
                tiposVisitantes={tiposVisitantes}
                condominioId={condominioId}
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) {
                        // Small delay to clear state after animation, or just clear immediately
                        setTimeout(() => setEditingVisitor(null), 100)
                    }
                }}
            />

            <VisitorBadgeDialog
                visitor={badgeVisitor}
                open={isBadgeOpen}
                onOpenChange={setIsBadgeOpen}
            />
        </>
    )
}
