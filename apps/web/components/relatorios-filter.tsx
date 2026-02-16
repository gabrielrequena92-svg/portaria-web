'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import { Filter, X } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from '@/components/ui/sheet'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export function RelatoriosFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [dataInicio, setDataInicio] = useState(searchParams.get('data_inicio') || '')
    const [dataFim, setDataFim] = useState(searchParams.get('data_fim') || '')
    const [tipo, setTipo] = useState(searchParams.get('tipo') || 'todos')

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (dataInicio) params.set('data_inicio', dataInicio)
        else params.delete('data_inicio')

        if (dataFim) params.set('data_fim', dataFim)
        else params.delete('data_fim')

        if (tipo && tipo !== 'todos') params.set('tipo', tipo)
        else params.delete('tipo')

        router.push(`/dashboard/relatorios?${params.toString()}`)
    }

    const handleClear = () => {
        setDataInicio('')
        setDataFim('')
        setTipo('todos')
        router.push('/dashboard/relatorios')
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="rounded-2xl h-12 px-6 gap-2 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                    <Filter className="h-4 w-4" />
                    Filtrar
                </Button>
            </SheetTrigger>
            <SheetContent className="rounded-l-[2.5rem] border-white/20 bg-white/80 backdrop-blur-2xl">
                <SheetHeader className="mb-8">
                    <SheetTitle className="text-3xl font-black tracking-tight">Filtros Avançados</SheetTitle>
                    <SheetDescription className="font-medium text-slate-500">
                        Refine sua busca por data e tipo de acesso.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8 py-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Data Inicial</Label>
                        <Input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Data Final</Label>
                        <Input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-black uppercase tracking-widest text-slate-400">Tipo de Acesso</Label>
                        <Select value={tipo} onValueChange={setTipo}>
                            <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                                <SelectItem value="todos">Todos os Registros</SelectItem>
                                <SelectItem value="entrada">Apenas Entradas</SelectItem>
                                <SelectItem value="saida">Apenas Saídas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <SheetFooter className="mt-12 flex flex-col gap-3">
                    <SheetClose asChild>
                        <Button onClick={handleApply} className="h-14 w-full rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-lg shadow-primary/20 transition-all">
                            Aplicar Filtros
                        </Button>
                    </SheetClose>
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="h-14 w-full rounded-2xl font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                        Limpar Filtros
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
