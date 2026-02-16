import jsPDF from 'jspdf'

interface VisitorBadgeData {
    nome: string
    cpf: string
    empresa?: string
    fotoUrl?: string
    qrCodeDataUrl: string
}

export const generateVisitorBadge = async (data: VisitorBadgeData) => {
    // A4 dimensions in mm
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Badge Dimensions (Vertical Credit Card size)
    const badgeWidth = 54
    const badgeHeight = 85

    // Calculate positions to center both sides
    const centerX = pageWidth / 2
    const startY = 40 // Top margin
    const gap = 20 // Gap between front and back

    // --- FRONT SIDE ---
    const frontX = centerX - (badgeWidth / 2)
    const frontY = startY

    // 1. Background & Border
    doc.setDrawColor(230, 230, 230)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(frontX, frontY, badgeWidth, badgeHeight, 3, 3, 'FD')

    // 2. Header Block
    doc.setFillColor(5, 150, 105) // Emerald-600
    doc.rect(frontX, frontY, badgeWidth, 24, 'F')

    // Header Pattern
    doc.setFillColor(255, 255, 255)
    // @ts-ignore - GState constructor type missing in jspdf types
    doc.setGState(new doc.GState({ opacity: 0.1 }))
    doc.circle(frontX + badgeWidth - 5, frontY + 5, 10, 'F')
    doc.circle(frontX + 5, frontY + 20, 15, 'F')
    // @ts-ignore
    doc.setGState(new doc.GState({ opacity: 1.0 }))

    // "VISITANTE" Label
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setCharSpace(2)
    doc.text('VISITANTE', centerX, frontY + 10, { align: 'center' })
    doc.setCharSpace(0)

    // 3. Photo
    const photoSize = 28
    const photoY = frontY + 14 // Starts inside header

    // Photo Background (White Box behind)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(centerX - (photoSize / 2) - 1, photoY - 1, photoSize + 2, photoSize + 2, 2, 2, 'F')

    if (data.fotoUrl) {
        try {
            // Square photo with rounded white border effect via the background rect above
            doc.addImage(data.fotoUrl, 'JPEG', centerX - (photoSize / 2), photoY, photoSize, photoSize)
        } catch (e) {
            // Fallback
            doc.setFillColor(241, 245, 249)
            doc.rect(centerX - (photoSize / 2), photoY, photoSize, photoSize, 'F')
            doc.setTextColor(148, 163, 184)
            doc.setFontSize(8)
            doc.text('FOTO', centerX, photoY + (photoSize / 2) + 3, { align: 'center' })
        }
    } else {
        doc.setFillColor(241, 245, 249)
        doc.rect(centerX - (photoSize / 2), photoY, photoSize, photoSize, 'F')
    }

    // 4. Content Content
    const contentStartY = photoY + photoSize + 8

    // Visitor Name
    doc.setTextColor(15, 23, 42) // Slate-900
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')

    // Handle long names
    let nameY = contentStartY
    const splitName = doc.splitTextToSize(data.nome.toUpperCase(), badgeWidth - 6)

    if (splitName.length > 2) {
        // Truncate if too long (rare)
        doc.text(splitName[0] + ' ' + splitName[1] + '...', centerX, nameY, { align: 'center' })
        nameY += 6
    } else {
        doc.text(splitName, centerX, nameY, { align: 'center', lineHeightFactor: 1.15 })
        nameY += (splitName.length * 5) + 2
    }

    // Divider
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.5)
    doc.line(centerX - 8, nameY + 2, centerX + 8, nameY + 2)

    // Company
    nameY += 8
    if (data.empresa) {
        doc.setFontSize(9)
        doc.setTextColor(5, 150, 105) // Emerald-600
        doc.setFont('helvetica', 'bold')
        const splitCompany = doc.splitTextToSize(data.empresa.toUpperCase(), badgeWidth - 6)
        doc.text(splitCompany, centerX, nameY, { align: 'center' })
        nameY += (splitCompany.length * 4) + 2
    } else {
        doc.setFontSize(9)
        doc.setTextColor(100, 116, 139)
        doc.setFont('helvetica', 'italic')
        doc.text('Particular', centerX, nameY, { align: 'center' })
        nameY += 6
    }

    // CPF
    nameY += 2
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.text(data.cpf, centerX, nameY, { align: 'center' })

    // Footer Logo
    doc.addImage('/logo-icon.png', 'PNG', centerX - 4, frontY + badgeHeight - 10, 8, 8)

    // --- BACK SIDE (QR Code) ---
    const backX = centerX - (badgeWidth / 2)
    const backY = frontY + badgeHeight + gap

    // Border
    doc.setDrawColor(230, 230, 230)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(backX, backY, badgeWidth, badgeHeight, 3, 3, 'FD')

    // Top Instruction
    doc.setFillColor(248, 250, 252) // Slate-50
    doc.roundedRect(backX, backY, badgeWidth, 12, 3, 3, 'F')
    // Cover bottom radius of header
    doc.rect(backX, backY + 6, badgeWidth, 6, 'F')

    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105) // Slate-600
    doc.setFont('helvetica', 'bold')
    doc.text('ACESSO SEGURO', centerX, backY + 8, { align: 'center' })

    // QR Code
    const qrSize = 42
    doc.addImage(data.qrCodeDataUrl, 'PNG', centerX - (qrSize / 2), backY + (badgeHeight / 2) - (qrSize / 2) + 2, qrSize, qrSize)

    // Bottom Instruction
    doc.setFontSize(7)
    doc.setTextColor(148, 163, 184) // Slate-400
    doc.setFont('helvetica', 'normal')
    doc.text('Aproxime este código do leitor', centerX, backY + badgeHeight - 12, { align: 'center' })
    doc.text('na portaria para liberar sua entrada.', centerX, backY + badgeHeight - 8, { align: 'center' })

    // Cut Lines (Dotted)
    doc.setDrawColor(200, 200, 200)
    doc.setLineDashPattern([2, 2], 0)
    doc.rect(frontX - 2, frontY - 2, badgeWidth + 4, badgeHeight + 4)
    doc.rect(backX - 2, backY - 2, badgeWidth + 4, badgeHeight + 4)
    doc.setLineDashPattern([], 0)

    // Metadata
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Portaria SaaS - Gerado em ' + new Date().toLocaleDateString(), 10, pageHeight - 10)

    doc.save(`Cracha-${data.nome.replace(/\s+/g, '_')}.pdf`)
}
