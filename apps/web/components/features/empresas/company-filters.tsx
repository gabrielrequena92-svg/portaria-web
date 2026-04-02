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

export function CompanyFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [name, setName] = useState(searchParams.get('nome') || '')

  // Debounce for name search
  useEffect(() => {
    const handler = setTimeout(() => {
      handleFilter('nome', name)
    }, 500)
    return () => clearTimeout(handler)
  }, [name])

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  function clearFilters() {
    setName('')
    startTransition(() => {
      router.push('/dashboard/empresas')
    })
  }

  const hasFilters = searchParams.get('nome') || searchParams.get('status') || searchParams.get('doc_status')

  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome da empresa..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select
          value={searchParams.get('status') || 'ativa'}
          onValueChange={(v) => handleFilter('status', v)}
        >
          <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Status Empresa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="ativa">Ativa</SelectItem>
            <SelectItem value="bloqueada">Bloqueada</SelectItem>
            <SelectItem value="inativa">Inativa</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={searchParams.get('doc_status') || 'all'}
          onValueChange={(v) => handleFilter('doc_status', v)}
        >
          <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
            <SelectValue placeholder="Status Documentação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Doc.</SelectItem>
            <SelectItem value="valido">Em dia</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
            <SelectItem value="sem_documentos">Sem documentos</SelectItem>
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
  )
}
