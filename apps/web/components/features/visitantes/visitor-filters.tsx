'use client'

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useEffect, useState } from "react"
import { Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VisitorFiltersProps {
  empresas: { id: string; nome: string }[]
}

export function VisitorFilters({ empresas }: VisitorFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [search, setSearch] = useState(searchParams.get('search') || '')

  // Debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      handleFilter('search', search)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Always reset to first page or clear relevant params when searching? 
    // Here we just update the URL.
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  function clearFilters() {
    setSearch('')
    startTransition(() => {
      router.push('/dashboard/visitantes')
    })
  }

  const hasFilters = searchParams.get('search') || 
                     searchParams.get('empresa_id') || 
                     searchParams.get('status') || 
                     searchParams.get('doc_status')

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <Select
            value={searchParams.get('empresa_id') || 'all'}
            onValueChange={(v) => handleFilter('empresa_id', v)}
          >
            <SelectTrigger className="w-[200px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Empresas</SelectItem>
              {empresas.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get('status') || 'all'}
            onValueChange={(v) => handleFilter('status', v)}
          >
            <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="bloqueado">Bloqueado</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get('doc_status') || 'all'}
            onValueChange={(v) => handleFilter('doc_status', v)}
          >
            <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="Status Doc." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Doc.</SelectItem>
              <SelectItem value="valido">Em dia</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="vencido">Vencido</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}

          {isPending && (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>
      </div>
    </div>
  )
}
