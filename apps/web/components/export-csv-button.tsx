'use client'

import { Button } from './ui/button'
import { FileSpreadsheet } from 'lucide-react'
import { formatDateTime } from '@/lib/utils/date'

interface ExportCsvButtonProps {
    data: any[]
}

export function ExportCsvButton({ data }: ExportCsvButtonProps) {
    const handleExport = () => {
        // Define headers
        const headers = ["ID", "Visitante", "Status", "CPF", "Empresa", "Veiculo", "Tipo", "Data", "Horario"]

        // Convert data to CSV rows
        const rows = data.map(reg => [
            reg.id,
            reg.visitante_nome_snapshot,
            (reg.status_snapshot || '-').toUpperCase(),
            reg.visitante_cpf_snapshot || '-',
            reg.empresa_nome_snapshot || '-',
            reg.placa_veiculo || '-',
            reg.tipo.toUpperCase(),
            formatDateTime(reg.data_registro).split(' ')[0], // Date part
            formatDateTime(reg.data_registro).split(' ')[1]  // Time part
        ])

        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
        ].join('\n')

        // Create Blob and Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.setAttribute('href', url)
        link.setAttribute('download', `relatorio-acessos-${new Date().getTime()}.csv`)
        link.style.visibility = 'hidden'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            onClick={handleExport}
            variant="outline"
            className="rounded-2xl h-12 px-6 gap-2 font-bold border-emerald-100 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 transition-all shadow-sm"
        >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar CSV
        </Button>
    )
}
