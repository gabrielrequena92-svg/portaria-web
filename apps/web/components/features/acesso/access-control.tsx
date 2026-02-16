'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Loader2, ScanLine, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface VisitorData {
    id: string
    nome: string
    cpf: string
    foto_url: string | null
    status: 'ativo' | 'bloqueado' | 'inativo'
    empresa?: {
        nome: string
        status: 'ativa' | 'inativa' | 'bloqueada'
    } | null
    condominio_id: string
}

type AccessStatus = 'idle' | 'loading' | 'allowed' | 'denied' | 'warning'

export function AccessControl() {
    const [code, setCode] = useState('')
    const [visitor, setVisitor] = useState<VisitorData | null>(null)
    const [status, setStatus] = useState<AccessStatus>('idle')
    const [message, setMessage] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    // Focus input on mount and keep focus for scanner
    useEffect(() => {
        inputRef.current?.focus()
        const handleBlur = () => {
            // Optional: aggressive refocus for dedicated kiosks
            // setTimeout(() => inputRef.current?.focus(), 100) 
        }
        const input = inputRef.current
        input?.addEventListener('blur', handleBlur)
        return () => input?.removeEventListener('blur', handleBlur)
    }, [])

    const validateAccess = async (qrCode: string) => {
        setStatus('loading')
        setVisitor(null)
        setMessage('')

        try {
            // Expected format: {"v":"v1","id":"UUID","c":"UUID"}
            // Or just UUID if legacy/simplified
            let visitorId = qrCode
            try {
                const parsed = JSON.parse(qrCode)
                if (parsed.id) visitorId = parsed.id
            } catch (e) {
                // Not JSON, assume direct ID string
            }

            // Fetch visitor with company relation
            const { data, error } = await supabase
                .from('visitantes')
                .select(`
                    id, nome, cpf, foto_url, status, condominio_id,
                    empresa:empresas(nome, status)
                `)
                .eq('id', visitorId)
                .single()

            if (error || !data) {
                setStatus('denied')
                setMessage('Visitante não encontrado.')
                return
            }

            const visitorData = data as unknown as VisitorData
            setVisitor(visitorData)

            // Check Logic
            if (visitorData.status === 'bloqueado') {
                setStatus('denied')
                setMessage('VISITANTE BLOQUEADO')
                return
            }

            if (visitorData.status === 'inativo') {
                setStatus('denied')
                setMessage('CADASTRO INATIVO')
                return
            }

            if (visitorData.empresa?.status === 'bloqueada') {
                setStatus('denied')
                setMessage(`EMPRESA BLOQUEADA: ${visitorData.empresa.nome}`)
                return
            }

            if (visitorData.empresa?.status === 'inativa') {
                setStatus('warning') // Maybe allow but warn? Or deny?
                setMessage(`Empresa Inativa: ${visitorData.empresa.nome}`)
                return
            }

            // All clear - Insert Record
            const { error: insertError } = await supabase
                .from('registros')
                .insert({
                    visitante_id: visitorData.id,
                    tipo: 'entrada', // Defaulting to simple entry for now
                    data_registro: new Date().toISOString(),
                    visitante_nome_snapshot: visitorData.nome,
                    visitante_cpf_snapshot: visitorData.cpf,
                    empresa_nome_snapshot: visitorData.empresa?.nome || null,
                    visitor_photo_snapshot: visitorData.foto_url
                })

            if (insertError) {
                console.error('Error saving record:', insertError)
                toast.error('Erro ao salvar registro de histórico.')
            }

            setStatus('allowed')
            setMessage('Acesso Permitido')
            toast.success(`Entrada registrada para ${visitorData.nome}`)

        } catch (error) {
            console.error(error)
            setStatus('denied')
            setMessage('Erro ao processar código.')
        } finally {
            // Clear code for next scan after delay?
            // setCode('') 
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (code.trim()) {
            validateAccess(code.trim())
            setCode('') // Clear input for next scan immediately
        }
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {/* Input Section */}
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ScanLine className="h-5 w-5" />
                        Leitura de QR Code
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            ref={inputRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Aguardando leitura..."
                            className="text-lg font-mono placeholder:text-slate-300"
                            autoComplete="off"
                        />
                        <Button type="submit" className="w-full" disabled={status === 'loading'}>
                            {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Validar Manualmente'}
                        </Button>
                    </form>
                    <div className="mt-4 text-xs text-slate-400 text-center">
                        Mantenha o foco no campo acima para leitura automática.
                    </div>
                </CardContent>
            </Card>

            {/* Result Section */}
            <Card className={`border-2 transition-colors duration-500 ${status === 'allowed' ? 'border-emerald-500 bg-emerald-50' :
                status === 'denied' ? 'border-red-500 bg-red-50' :
                    status === 'warning' ? 'border-amber-500 bg-amber-50' :
                        'border-slate-100'
                }`}>
                <CardContent className="flex flex-col items-center justify-center py-10 min-h-[300px]">
                    {status === 'idle' && (
                        <div className="text-center text-slate-400">
                            <ScanLine className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Aguardando validação...</p>
                        </div>
                    )}

                    {status === 'loading' && (
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    )}

                    {visitor && status !== 'loading' && (
                        <div className="w-full space-y-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="relative inline-block">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-lg mx-auto">
                                    <AvatarImage src={visitor.foto_url || ''} />
                                    <AvatarFallback className="text-2xl">{visitor.nome.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute bottom-0 right-0 p-2 rounded-full border-4 border-white ${status === 'allowed' ? 'bg-emerald-500 text-white' :
                                    status === 'denied' ? 'bg-red-500 text-white' :
                                        'bg-amber-500 text-white'
                                    }`}>
                                    {status === 'allowed' ? <CheckCircle2 className="h-6 w-6" /> :
                                        status === 'denied' ? <XCircle className="h-6 w-6" /> :
                                            <AlertTriangle className="h-6 w-6" />}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-slate-900">{visitor.nome}</h3>
                                <p className="text-slate-500 font-mono">{visitor.cpf}</p>
                                {visitor.empresa && (
                                    <Badge variant="outline" className="mt-2 bg-white/50">
                                        {visitor.empresa.nome}
                                    </Badge>
                                )}
                            </div>

                            <div className={`p-4 rounded-lg font-bold text-lg ${status === 'allowed' ? 'bg-emerald-100 text-emerald-800' :
                                status === 'denied' ? 'bg-red-100 text-red-800' :
                                    'bg-amber-100 text-amber-800'
                                }`}>
                                {message}
                            </div>
                        </div>
                    )}

                    {!visitor && status === 'denied' && (
                        <div className="text-center text-red-600 animate-in fade-in">
                            <XCircle className="h-16 w-16 mx-auto mb-4" />
                            <p className="font-bold text-lg">{message}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
