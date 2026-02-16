'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Printer, Loader2 } from 'lucide-react'
import { generateVisitorBadge } from '@/lib/badge-generator'
import { useState } from 'react'

interface VisitorBadgeDialogProps {
    visitor: {
        id: string
        nome: string
        cpf: string
        foto_url?: string | null
        empresa?: { nome: string } | null
        condominio_id: string
    } | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VisitorBadgeDialog({ visitor, open, onOpenChange }: VisitorBadgeDialogProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    if (!visitor) return null

    const qrData = JSON.stringify({
        v: 'v1',
        id: visitor.id,
        c: visitor.condominio_id
    })

    const handleDownloadQR = () => {
        const svg = document.getElementById('qr-code-badge')
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg)
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()
            img.onload = () => {
                // Add extra height for text
                const padding = 20
                const textHeight = 50
                canvas.width = img.width + (padding * 2)
                canvas.height = img.height + textHeight + (padding * 2)

                if (ctx) {
                    // White background
                    ctx.fillStyle = 'white'
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Draw QR
                    ctx.drawImage(img, padding, padding)

                    // Draw Text
                    ctx.fillStyle = 'black'
                    ctx.textAlign = 'center'

                    // Name
                    ctx.font = 'bold 16px Arial'
                    ctx.fillText(visitor.nome.toUpperCase(), canvas.width / 2, img.height + padding + 25)

                    // Company (optional)
                    if (visitor.empresa?.nome) {
                        ctx.fillStyle = '#64748b' // Slate-500
                        ctx.font = '14px Arial'
                        ctx.fillText(visitor.empresa.nome, canvas.width / 2, img.height + padding + 45)
                    }
                }

                const pngFile = canvas.toDataURL('image/png')
                const downloadLink = document.createElement('a')
                downloadLink.download = `${visitor.nome.replace(/\s+/g, '_')}-QRCode.png`
                downloadLink.href = `${pngFile}`
                downloadLink.click()
            }
            img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }
    }

    const handlePrintBadge = async () => {
        setIsGenerating(true)
        try {
            // Check if photo is from our storage bucket and try to fetch it to get a blob/base64 
            // OR if it's already a public URL that jspdf can handle.
            // For now passing the URL directly. If CORS fails, the generator handles fallback.

            // Need to get QR Code as DataURL
            const svg = document.getElementById('qr-code-badge')
            let qrDataUrl = ''
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg)
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const img = new Image()

                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        canvas.width = img.width
                        canvas.height = img.height
                        ctx?.drawImage(img, 0, 0)
                        qrDataUrl = canvas.toDataURL('image/png')
                        resolve()
                    }
                    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
                })
            }

            await generateVisitorBadge({
                nome: visitor.nome,
                cpf: visitor.cpf,
                empresa: visitor.empresa?.nome,
                fotoUrl: visitor.foto_url || undefined,
                qrCodeDataUrl: qrDataUrl
            })
        } catch (error) {
            console.error('Error generating badge:', error)
            alert('Erro ao gerar crachá. Tente novamente.')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crachá de Visitante</DialogTitle>
                    <DialogDescription>
                        Imprima o crachá ou baixe o QR Code para acesso.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 space-y-6">
                    <div className="p-6 bg-white rounded-xl border-2 border-slate-100 shadow-lg">
                        <QRCodeSVG
                            id="qr-code-badge"
                            value={qrData}
                            size={180}
                            level="H"
                            includeMargin
                            imageSettings={{
                                src: "/logo-icon.png",
                                x: undefined,
                                y: undefined,
                                height: 34,
                                width: 34,
                                excavate: true,
                            }}
                        />
                    </div>

                    <div className="text-center">
                        <h3 className="font-bold text-lg text-slate-900">{visitor.nome}</h3>
                        <p className="text-sm text-slate-500">{visitor.empresa?.nome || 'Visitante'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button variant="outline" onClick={handleDownloadQR} className="h-12 border-slate-200">
                            <Download className="mr-2 h-4 w-4" />
                            Baixar QR
                        </Button>
                        <Button onClick={handlePrintBadge} disabled={isGenerating} className="h-12 bg-slate-900 hover:bg-slate-800 text-white">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Printer className="mr-2 h-4 w-4" />}
                            Imprimir Crachá
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
