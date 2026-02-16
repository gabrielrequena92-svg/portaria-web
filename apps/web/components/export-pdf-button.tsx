'use client'

import { Button } from './ui/button'
import { Download } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatDateTime } from '@/lib/utils/date'

interface ExportPdfButtonProps {
    data: any[]
}

export function ExportPdfButton({ data }: ExportPdfButtonProps) {
    const handleExport = () => {
        const doc = new jsPDF({ orientation: 'landscape' })

        // Add Title
        doc.setFontSize(20)
        doc.text('Relatório de Acessos - Portaria SaaS', 14, 22)
        doc.setFontSize(11)
        doc.setTextColor(100)
        doc.text(`Gerado em: ${formatDateTime(new Date())}`, 14, 30)

        // Define table columns
        const tableColumn = ["Visitante", "Status", "CPF", "Empresa", "Veículo/Placa", "Tipo", "Data/Hora"]
        const tableRows: any[] = []

        data.forEach(reg => {
            const rowData = [
                reg.visitante_nome_snapshot,
                (reg.status_snapshot || '-').toUpperCase(),
                reg.visitante_cpf_snapshot || '-',
                reg.empresa_nome_snapshot || '-',
                reg.placa_veiculo || '-',
                reg.tipo.toUpperCase(),
                formatDateTime(reg.data_registro)
            ]
            tableRows.push(rowData)
        })

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'striped',
            headStyles: { fillColor: [16, 185, 129] } // emerald-500
        })

        doc.save(`relatorio-acessos-${new Date().getTime()}.pdf`)
    }

    return (
        <Button
            onClick={handleExport}
            variant="outline"
            className="rounded-2xl h-12 px-6 gap-2 font-bold border-slate-200 hover:bg-slate-50 transition-all"
        >
            <Download className="h-4 w-4" />
            Exportar PDF
        </Button>
    )
}
