import { jsPDF } from 'jspdf';

export interface ReportPhoto {
  id: string;
  dataUrl: string;
  descricao: string;
  originalName?: string;
}

export interface ReportData {
  obraNome: string;
  obraCodigo: string;
  endereco: string;
  dataRef: string;
  engenheiro: string;
  coordenador: string;
  logoObra: string | null;
}

// Converte URL para base64 com segurança
const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
};

// Extrai ou calcula a tag de semana (ex: W34)
function extractWeekTag(dataRef: string): string {
  const match = dataRef.match(/W\d{1,2}/i);
  if (match) {
    return match[0].toUpperCase();
  }
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `W${String(weekNo).padStart(2, '0')}`;
}

export async function generateOfficialPDF(data: ReportData, photos: ReportPhoto[]) {
  // A4 Landscape: 297mm x 210mm
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const photosPerPage = 2;
  const numPages = Math.ceil(photos.length / photosPerPage) || 1;

  // Carregar logos oficiais
  let logoZopone: string | null = null;
  let logoZIncorp: string | null = null;
  let logoObraBase64: string | null = null;

  try {
    logoZopone = await getBase64ImageFromURL('/template_assets/image1.png');
  } catch (e) {
    console.warn('Logo Zopone não encontrada em /template_assets/image1.png');
  }

  try {
    logoZIncorp = await getBase64ImageFromURL('/template_assets/image2.png');
  } catch (e) {
    console.warn('Logo Z-Incorp não encontrada em /template_assets/image2.png');
  }

  if (data.logoObra) {
    try {
      logoObraBase64 = await getBase64ImageFromURL(data.logoObra);
    } catch (e) {
      console.warn('Logo da Obra não carregada');
    }
  }

  for (let i = 0; i < numPages; i++) {
    if (i > 0) doc.addPage();

    // ==========================================
    // 1. CABEÇALHO OFICIAL (EXCEL REPLICA)
    // ==========================================
    
    // Logos do Topo
    if (logoZopone) {
      doc.addImage(logoZopone, 'PNG', 12, 7, 45, 12, undefined, 'FAST');
    }

    if (logoObraBase64) {
      doc.addImage(logoObraBase64, 'PNG', 128, 6, 40, 13, undefined, 'FAST');
    }

    if (logoZIncorp) {
      doc.addImage(logoZIncorp, 'PNG', 255, 6, 30, 14, undefined, 'FAST');
    }

    // Título Principal (Linha 8 do Excel)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(0, 0, 0);
    doc.text('RELATÓRIO FOTOGRÁFICO ORGANIZAÇÃO ARRUMAÇÃO E LIMPEZA DA OBRA', 148.5, 23, { align: 'center' });

    // Semana / Data (Linha 10 do Excel)
    if (data.dataRef) {
      doc.setFontSize(11);
      doc.text(data.dataRef, 148.5, 29, { align: 'center' });
    }

    // Nome da Obra (Linha 12 do Excel)
    doc.setFontSize(10.5);
    doc.text(`Obra: ${data.obraNome.toUpperCase()}`, 12, 35.5);

    // Linha divisória
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.line(12, 38, 285, 38);

    // ==========================================
    // 2. FOTOS E DESCRIÇÕES (2 POR PÁGINA)
    // ==========================================
    const pagePhotos = photos.slice(i * photosPerPage, (i + 1) * photosPerPage);

    // --- FOTO 1 (ESQUERDA - B14:O29) ---
    const f1 = pagePhotos[0];
    const f1Number = String(i * 2 + 1).padStart(2, '0');

    // Moldura da Foto 1
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.4);
    doc.setFillColor(245, 245, 245);
    doc.rect(12, 41, 132, 114, 'FD');

    if (f1) {
      try {
        doc.addImage(f1.dataUrl, 'JPEG', 12.5, 41.5, 131, 113, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao adicionar Foto 1:', e);
      }
    }

    // Faixa DESCRIÇÃO da Foto 1 (Linha 32 do Excel)
    doc.setFillColor(235, 240, 245);
    doc.setDrawColor(120, 120, 120);
    doc.rect(12, 157, 132, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text('DESCRIÇÃO', 78, 161.2, { align: 'center' });

    // Caixa de Texto da Foto 1 (Linhas 34-37 do Excel)
    doc.setFillColor(255, 255, 255);
    doc.rect(12, 163, 132, 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(200, 20, 20);
    doc.text(`Foto ${f1Number}:`, 15, 168.5);

    if (f1 && f1.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      doc.text(f1.descricao, 15, 173.5, { maxWidth: 126 });
    }

    // --- FOTO 2 (DIREITA - Q14:AD29) ---
    const f2 = pagePhotos[1];
    const f2Number = String(i * 2 + 2).padStart(2, '0');

    // Moldura da Foto 2
    doc.setFillColor(245, 245, 245);
    doc.rect(153, 41, 132, 114, 'FD');

    if (f2) {
      try {
        doc.addImage(f2.dataUrl, 'JPEG', 153.5, 41.5, 131, 113, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao adicionar Foto 2:', e);
      }
    }

    // Faixa DESCRIÇÃO da Foto 2
    doc.setFillColor(235, 240, 245);
    doc.rect(153, 157, 132, 6, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    doc.text('DESCRIÇÃO', 219, 161.2, { align: 'center' });

    // Caixa de Texto da Foto 2
    doc.setFillColor(255, 255, 255);
    doc.rect(153, 163, 132, 24, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(200, 20, 20);
    doc.text(`Foto ${f2Number}:`, 156, 168.5);

    if (f2 && f2.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      doc.text(f2.descricao, 156, 173.5, { maxWidth: 126 });
    }

    // ==========================================
    // 3. RODAPÉ OFICIAL (Linha 30 do Excel)
    // ==========================================
    doc.setDrawColor(120, 120, 120);
    doc.setFillColor(250, 250, 250);
    doc.rect(12, 189, 273, 13, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(`Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}`, 15, 194);
    doc.text(`Coordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`, 15, 199);

    // Paginação
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    doc.text(`Página ${i + 1} de ${numPages}`, 280, 196.5, { align: 'right' });
  }

  // Baixa o arquivo com a identificação da semana no nome
  const cleanName = data.obraNome.replace(/\s+/g, '_') || 'Relatorio';
  const weekTag = extractWeekTag(data.dataRef);
  doc.save(`Relatorio_Fotografico_${cleanName}_${weekTag}.pdf`);
}
