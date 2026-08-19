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

// Carrega e comprime imagem garantindo PDF de alta fidelidade e tamanho leve (<10MB)
async function loadAndOptimizeImage(url: string, maxWidth = 1280, maxHeight = 800, quality = 0.75): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let origW = img.naturalWidth || img.width;
      let origH = img.naturalHeight || img.height;

      let targetW = origW;
      let targetH = origH;

      if (targetW > maxWidth || targetH > maxHeight) {
        const ratio = Math.min(maxWidth / targetW, maxHeight / targetH);
        targetW = Math.round(targetW * ratio);
        targetH = Math.round(targetH * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataUrl: url, width: origW, height: origH });
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const optimized = canvas.toDataURL('image/jpeg', quality);
      resolve({ dataUrl: optimized, width: targetW, height: targetH });
    };
    img.onerror = () => {
      resolve({ dataUrl: url, width: 800, height: 600 });
    };
    img.src = url;
  });
}

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
    compress: true
  });

  const photosPerPage = 2;
  const numPages = Math.ceil(photos.length / photosPerPage) || 1;

  // Carregar logos oficiais com tratamento resiliente
  let logoZopone: string | null = null;
  let logoZIncorp: string | null = null;
  let logoObra: string | null = null;

  try {
    const res1 = await loadAndOptimizeImage('/template_assets/image1.png', 600, 300, 0.9);
    logoZopone = res1.dataUrl;
  } catch (e) {
    console.warn('Logo Zopone não encontrada');
  }

  try {
    const res2 = await loadAndOptimizeImage('/template_assets/image2.png', 600, 300, 0.9);
    logoZIncorp = res2.dataUrl;
  } catch (e) {
    console.warn('Logo Z-Incorp não encontrada');
  }

  if (data.logoObra) {
    try {
      const resObra = await loadAndOptimizeImage(data.logoObra, 600, 300, 0.9);
      logoObra = resObra.dataUrl;
    } catch (e) {
      console.warn('Logo da Obra não carregada:', e);
    }
  }

  // Geometria idêntica à impressão da planilha Excel (A1:AE38)
  const leftColX = 15.0;
  const rightColX = 153.0;
  const colWidth = 129.0;

  const photoY = 62.0;
  const photoH = 84.0;

  const footerY = 148.0;
  const footerH = 14.0;

  const descHeadY = 163.5;
  const descHeadH = 8.5;

  const descBodyY = 172.5;
  const descBodyH = 20.0;

  for (let i = 0; i < numPages; i++) {
    if (i > 0) doc.addPage();

    // =========================================================================
    // 1. CABEÇALHO OFICIAL (Idêntico ao topo da planilha Excel A1:AE12)
    // =========================================================================

    // Logos do Topo
    if (logoZopone) {
      doc.addImage(logoZopone, 'JPEG', 50, 6, 48, 20, undefined, 'FAST');
    }

    if (logoObra) {
      doc.addImage(logoObra, 'JPEG', 128, 6, 40, 20, undefined, 'FAST');
    }

    if (logoZIncorp) {
      doc.addImage(logoZIncorp, 'JPEG', 198, 5, 48, 22, undefined, 'FAST');
    }

    // Linha 8 do Excel: Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      'RELATÓRIO FOTOGRÁFICO ORGANIZAÇÃO ARRUMAÇÃO E LIMPEZA DA OBRA',
      148.5,
      36.5,
      { align: 'center' }
    );

    // Linha 10 do Excel: Semana / Período
    if (data.dataRef) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0);
      doc.text(data.dataRef, 148.5, 46.5, { align: 'center' });
    }

    // Linha 12 do Excel: Nome da Obra (Célula B12:AD12)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(0, 0, 0);
    doc.text(`Obra: ${data.obraNome.toUpperCase()}`, leftColX, 56.0);

    // =========================================================================
    // 2. FOTOS E IDENTIFICAÇÃO (2 POR PÁGINA: B14:O29 e Q14:AD29)
    // =========================================================================
    const pagePhotos = photos.slice(i * photosPerPage, (i + 1) * photosPerPage);

    // ------------------- FOTO 1 (ESQUERDA: B14:O29) -------------------
    const f1 = pagePhotos[0];
    const f1Number = String(i * 2 + 1).padStart(2, '0');

    // Moldura externa da Foto 1
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.35);
    doc.setFillColor(250, 250, 250);
    doc.rect(leftColX, photoY, colWidth, photoH, 'FD');

    if (f1) {
      try {
        const opt1 = await loadAndOptimizeImage(f1.dataUrl, 1280, 800, 0.75);
        // Calcular enquadramento proporcional centralizado
        const imgRatio = opt1.width / opt1.height;
        const boxRatio = (colWidth - 2) / (photoH - 2);
        let drawW = colWidth - 2;
        let drawH = photoH - 2;
        let drawX = leftColX + 1;
        let drawY = photoY + 1;

        if (imgRatio > boxRatio) {
          drawH = (colWidth - 2) / imgRatio;
          drawY = photoY + 1 + (photoH - 2 - drawH) / 2;
        } else {
          drawW = (photoH - 2) * imgRatio;
          drawX = leftColX + 1 + (colWidth - 2 - drawW) / 2;
        }

        doc.addImage(opt1.dataUrl, 'JPEG', drawX, drawY, drawW, drawH, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao renderizar Foto 1:', e);
      }
    }

    // Rodapé 1 (Linhas B30:O31)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(leftColX, footerY, colWidth, footerH, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}`,
      leftColX + colWidth / 2,
      footerY + 5.5,
      { align: 'center' }
    );
    doc.text(
      `Coordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`,
      leftColX + colWidth / 2,
      footerY + 10.5,
      { align: 'center' }
    );

    // Faixa DESCRIÇÃO 1 (Linhas B32:O33)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(leftColX, descHeadY, colWidth, descHeadH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 0, 0); // Vermelho oficial
    doc.text('DESCRIÇÃO', leftColX + colWidth / 2, descHeadY + 5.5, { align: 'center' });

    // Caixa de Texto da Legenda 1 (Linhas B34:O37)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(leftColX, descBodyY, colWidth, descBodyH, 'FD');

    // "Foto 01:" em vermelho negrito
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 0, 0);
    const prefix1 = `Foto ${f1Number}: `;
    doc.text(prefix1, leftColX + 3.5, descBodyY + 7);

    // Texto da legenda em preto com quebra automática
    if (f1 && f1.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      const prefixW = doc.getTextWidth(prefix1);
      doc.text(f1.descricao, leftColX + 3.5 + prefixW, descBodyY + 7, {
        maxWidth: colWidth - prefixW - 7
      });
    }

    // ------------------- FOTO 2 (DIREITA: Q14:AD29) -------------------
    const f2 = pagePhotos[1];
    const f2Number = String(i * 2 + 2).padStart(2, '0');

    // Moldura externa da Foto 2
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(250, 250, 250);
    doc.rect(rightColX, photoY, colWidth, photoH, 'FD');

    if (f2) {
      try {
        const opt2 = await loadAndOptimizeImage(f2.dataUrl, 1280, 800, 0.75);
        const imgRatio2 = opt2.width / opt2.height;
        const boxRatio2 = (colWidth - 2) / (photoH - 2);
        let drawW2 = colWidth - 2;
        let drawH2 = photoH - 2;
        let drawX2 = rightColX + 1;
        let drawY2 = photoY + 1;

        if (imgRatio2 > boxRatio2) {
          drawH2 = (colWidth - 2) / imgRatio2;
          drawY2 = photoY + 1 + (photoH - 2 - drawH2) / 2;
        } else {
          drawW2 = (photoH - 2) * imgRatio2;
          drawX2 = rightColX + 1 + (colWidth - 2 - drawW2) / 2;
        }

        doc.addImage(opt2.dataUrl, 'JPEG', drawX2, drawY2, drawW2, drawH2, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao renderizar Foto 2:', e);
      }
    }

    // Rodapé 2 (Linhas Q30:AD31)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(rightColX, footerY, colWidth, footerH, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}`,
      rightColX + colWidth / 2,
      footerY + 5.5,
      { align: 'center' }
    );
    doc.text(
      `Coordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`,
      rightColX + colWidth / 2,
      footerY + 10.5,
      { align: 'center' }
    );

    // Faixa DESCRIÇÃO 2 (Linhas Q32:AD33)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(rightColX, descHeadY, colWidth, descHeadH, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 0, 0);
    doc.text('DESCRIÇÃO', rightColX + colWidth / 2, descHeadY + 5.5, { align: 'center' });

    // Caixa de Texto da Legenda 2 (Linhas Q34:AD37)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(rightColX, descBodyY, colWidth, descBodyH, 'FD');

    // "Foto 02:" em vermelho negrito
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 0, 0);
    const prefix2 = `Foto ${f2Number}: `;
    doc.text(prefix2, rightColX + 3.5, descBodyY + 7);

    // Texto da legenda em preto com quebra automática
    if (f2 && f2.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      const prefixW2 = doc.getTextWidth(prefix2);
      doc.text(f2.descricao, rightColX + 3.5 + prefixW2, descBodyY + 7, {
        maxWidth: colWidth - prefixW2 - 7
      });
    }

    // Número da página discreto no canto inferior direito
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i + 1} de ${numPages}`, 282, 203, { align: 'right' });
  }

  // Nome do arquivo
  const cleanName = data.obraNome.replace(/\s+/g, '_') || 'Relatorio';
  const weekTag = extractWeekTag(data.dataRef);
  const fileName = `Relatorio_Fotografico_${cleanName}_${weekTag}.pdf`;

  const blob = doc.output('blob');
  doc.save(fileName);

  return {
    blob,
    fileName
  };
}
