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

    // Badge Dimensions (CR80 Credit Card size: 85.60 × 53.98 mm)
    const badgeWidth = 54
    const badgeHeight = 86

    // Calculate positions to center both sides
    const centerX = pageWidth / 2
    const startY = 30 // Top margin
    const gap = 15 // Gap between front and back

    // --- FRONT SIDE ---
    const frontX = centerX - (badgeWidth / 2)
    const frontY = startY

    // 1. Background & Border
    doc.setDrawColor(200, 200, 200)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(frontX, frontY, badgeWidth, badgeHeight, 3, 3, 'FD')

    // 2. Header Block (Logo + System Name)
    const headerHeight = 22
    doc.setFillColor(255, 255, 255) // White background for header to make logo pop
    // Draw bottom border for header
    doc.setDrawColor(226, 232, 240) // Slate-200
    doc.setLineWidth(0.5)
    doc.line(frontX, frontY + headerHeight, frontX + badgeWidth, frontY + headerHeight)

    // Logo & System Name Calculation
    try {
        // Logo (Left aligned in header)
        doc.addImage('/logo.png', 'PNG', frontX + 4, frontY + 4, 14, 14) // Assuming logo.png exists and is square-ish

        // System Name (Right of logo)
        doc.setTextColor(15, 23, 42) // Slate-900
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('Portaria', frontX + 22, frontY + 10)

        doc.setTextColor(100, 116, 139) // Slate-500
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text('SaaS', frontX + 41, frontY + 10) // Small "SaaS" suffix

        doc.setFontSize(7)
        doc.setTextColor(148, 163, 184) // Slate-400
        doc.setFont('helvetica', 'normal')
        doc.text('CONTROLE DE ACESSO', frontX + 22, frontY + 15)

    } catch (e) {
        // Fallback if logo fails
        doc.setTextColor(15, 23, 42)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Portaria SaaS', centerX, frontY + 12, { align: 'center' })
    }

    // "VISITANTE" Label - REMOVED as per user request
    // Adjusting layout to move everything up

    // 3. Photo (Prominent)
    const photoSize = 36 // Slightly larger for better visibility
    const photoY = frontY + headerHeight + 6 // Moved up significantly

    if (data.fotoUrl) {
        try {
            doc.addImage(data.fotoUrl, 'JPEG', centerX - (photoSize / 2), photoY, photoSize, photoSize)
            // Border around photo
            doc.setDrawColor(226, 232, 240)
            doc.setLineWidth(0.5)
            doc.roundedRect(centerX - (photoSize / 2), photoY, photoSize, photoSize, 2, 2, 'S')
        } catch (e) {
            // Fallback
            doc.setFillColor(241, 245, 249)
            doc.roundedRect(centerX - (photoSize / 2), photoY, photoSize, photoSize, 2, 2, 'F')
            doc.setTextColor(148, 163, 184)
            doc.setFontSize(9)
            doc.text('FOTO', centerX, photoY + (photoSize / 2), { align: 'center' })
        }
    } else {
        doc.setFillColor(241, 245, 249)
        doc.roundedRect(centerX - (photoSize / 2), photoY, photoSize, photoSize, 2, 2, 'F')
        doc.setTextColor(148, 163, 184)
        doc.setFontSize(9)
        doc.text('SEM FOTO', centerX, photoY + (photoSize / 2), { align: 'center' })
    }

    // 4. Visitor Details
    let currentY = photoY + photoSize + 8

    // Name - Auto-scaling logic
    doc.setTextColor(15, 23, 42) // Slate-900
    doc.setFont('helvetica', 'bold')

    const maxNameWidth = badgeWidth - 8
    let nameFontSize = 15 // Started larger
    let splitName = doc.splitTextToSize(data.nome.toUpperCase(), maxNameWidth)

    // Attempt to fit in fewer lines by reducing font size if necessary
    if (splitName.length > 2) {
        nameFontSize = 12
        doc.setFontSize(nameFontSize)
        splitName = doc.splitTextToSize(data.nome.toUpperCase(), maxNameWidth)
    } else if (splitName.length === 2 && splitName[0].length > 10) {
        // Even if 2 lines, if they are long, reduce a bit
        nameFontSize = 13
        doc.setFontSize(nameFontSize)
        splitName = doc.splitTextToSize(data.nome.toUpperCase(), maxNameWidth)
    } else {
        doc.setFontSize(nameFontSize)
    }

    doc.text(splitName, centerX, currentY, { align: 'center', lineHeightFactor: 1.1 })
    currentY += (splitName.length * (nameFontSize * 0.4)) + 4

    // Company (if exists)
    if (data.empresa) {
        doc.setFontSize(11) // Increased visibility
        doc.setTextColor(5, 150, 105) // Emerald-600
        doc.setFont('helvetica', 'bold')
        const splitCompany = doc.splitTextToSize(data.empresa.toUpperCase(), maxNameWidth)
        doc.text(splitCompany, centerX, currentY, { align: 'center' })
        currentY += (splitCompany.length * 4) + 3
    }

    // CPF
    doc.setFontSize(10)
    doc.setTextColor(71, 85, 105) // Slate-600
    doc.setFont('helvetica', 'normal')
    doc.text(data.cpf, centerX, currentY, { align: 'center' })

    // --- BACK SIDE (QR Code) ---
    const backX = centerX - (badgeWidth / 2)
    const backY = frontY + badgeHeight + gap

    // Border
    doc.setDrawColor(200, 200, 200)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(backX, backY, badgeWidth, badgeHeight, 3, 3, 'FD')

    // QR Code Area
    const qrSize = 45
    const qrY = backY + (badgeHeight / 2) - (qrSize / 2) - 5

    doc.addImage(data.qrCodeDataUrl, 'PNG', centerX - (qrSize / 2), qrY, qrSize, qrSize)

    // Instructions
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.text('ACESSO SEGURO', centerX, backY + 15, { align: 'center' })

    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.setFont('helvetica', 'normal')
    doc.text('Aproxime o QR Code do leitor', centerX, backY + badgeHeight - 20, { align: 'center' })
    doc.text('na portaria.', centerX, backY + badgeHeight - 16, { align: 'center' })

    // Cut Lines (Dotted)
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.1)
    doc.setLineDashPattern([2, 2], 0)
    doc.rect(frontX - 1, frontY - 1, badgeWidth + 2, badgeHeight + 2)
    doc.rect(backX - 1, backY - 1, badgeWidth + 2, badgeHeight + 2)
    doc.setLineDashPattern([], 0)

    // Footer Metadata
    doc.setFontSize(6)
    doc.setTextColor(180, 180, 180)
    doc.text(`Gerado em ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - Portaria SaaS`, 10, pageHeight - 5)

    doc.save(`Cracha-${data.nome.replace(/\s+/g, '_')}.pdf`)
}
