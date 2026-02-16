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
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CompanyDialog } from './company-dialog'
import { useState } from 'react'

interface Company {
    id: string
    nome: string
    cnpj: string | null
    status: 'ativa' | 'bloqueada' | 'inativa'
}

export function CompanyList({ data }: { data: Company[] }) {
    const [editingCompany, setEditingCompany] = useState<Company | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleEdit = (company: Company) => {
        setEditingCompany(company)
        setIsDialogOpen(true)
    }

    return (
        <>
            <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                            <TableHead className="w-[300px] text-xs font-bold uppercase tracking-wider text-slate-500 pl-8 py-4">Nome</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">CNPJ</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</TableHead>
                            <TableHead className="w-[100px] text-end pr-8">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((company) => (
                            <TableRow key={company.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                <TableCell className="font-semibold text-slate-900 pl-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold">
                                            {company.nome[0]}
                                        </div>
                                        {company.nome}
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500 font-medium font-mono text-xs">{company.cnpj || '-'}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant="outline"
                                        className={
                                            company.status === 'ativa'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                : company.status === 'bloqueada'
                                                    ? 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                                        }
                                    >
                                        <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${company.status === 'ativa' ? 'bg-emerald-500' :
                                                company.status === 'bloqueada' ? 'bg-red-500' :
                                                    'bg-slate-400'
                                            }`} />
                                        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
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
                                        <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-slate-100 p-2">
                                            <DropdownMenuLabel className="text-xs text-slate-400 uppercase tracking-widest px-2">Ações</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => handleEdit(company)}
                                                className="rounded-lg cursor-pointer focus:bg-primary/5 focus:text-primary font-medium"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar Empresa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog de Edição controlado pelo estado local se precisar abrir programaticamente */}
            {editingCompany && (
                <CompanyDialog
                    company={editingCompany}
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setEditingCompany(null)
                    }}
                />
            )}
        </>
    )
}
