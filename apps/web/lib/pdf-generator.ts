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

// Comprime e redimensiona imagem para manter PDF leve (< 10MB mesmo com dezenas de fotos)
async function compressAndOptimizeImage(url: string, maxWidth = 1280, maxHeight = 720, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Manter proporção
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(url);
        return;
      }

      // Preenchimento branco de fundo para transparências
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      // Exportar como JPEG comprimido
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    img.onerror = (e) => {
      console.warn('Erro ao comprimir imagem, usando original:', e);
      resolve(url);
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
  // A4 Landscape: 297mm x 210mm (Exato como a impressão da planilha oficial)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const photosPerPage = 2;
  const numPages = Math.ceil(photos.length / photosPerPage) || 1;

  // Carregar e otimizar logos oficiais
  let logoZopone: string | null = null;
  let logoZIncorp: string | null = null;
  let logoObra: string | null = null;

  try {
    logoZopone = await compressAndOptimizeImage('/template_assets/image1.png', 600, 300, 0.9);
  } catch (e) {
    console.warn('Logo Zopone não encontrada');
  }

  try {
    logoZIncorp = await compressAndOptimizeImage('/template_assets/image2.png', 600, 300, 0.9);
  } catch (e) {
    console.warn('Logo Z-Incorp não encontrada');
  }

  if (data.logoObra) {
    try {
      logoObra = await compressAndOptimizeImage(data.logoObra, 600, 300, 0.9);
    } catch (e) {
      console.warn('Logo da Obra não carregada');
    }
  }

  // Dimensões exatas calculadas a partir da planilha oficial Relatorio_Modelo_OK.xlsx
  const p1_x = 15.0;
  const p1_w = 129.0;
  const p2_x = 153.0;
  const p2_w = 129.0;

  const photo_y = 75.0;
  const photo_h = 74.0;

  const footer_y = 150.0;
  const footer_h = 14.0;

  const descHead_y = 164.5;
  const descHead_h = 8.5;

  const descBody_y = 173.0;
  const descBody_h = 18.0;

  for (let i = 0; i < numPages; i++) {
    if (i > 0) doc.addPage();

    // =========================================================================
    // 1. CABEÇALHO OFICIAL (Idêntico ao topo da planilha Excel A1:AE12)
    // =========================================================================
    
    // Logos do Topo
    if (logoZopone) {
      doc.addImage(logoZopone, 'JPEG', 50, 8, 48, 22, undefined, 'FAST');
    }

    if (logoObra) {
      doc.addImage(logoObra, 'JPEG', 128, 8, 40, 22, undefined, 'FAST');
    }

    if (logoZIncorp) {
      doc.addImage(logoZIncorp, 'JPEG', 198, 7, 48, 24, undefined, 'FAST');
    }

    // Linha 8 do Excel: Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      'RELATÓRIO FOTOGRÁFICO ORGANIZAÇÃO ARRUMAÇÃO E LIMPEZA DA OBRA',
      148.5,
      46,
      { align: 'center' }
    );

    // Linha 10 do Excel: Semana / Período
    if (data.dataRef) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(data.dataRef, 148.5, 57, { align: 'center' });
    }

    // Linha 12 do Excel: Nome da Obra
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(`Obra: ${data.obraNome.toUpperCase()}`, 148.5, 68, { align: 'center' });

    // =========================================================================
    // 2. FOTOS E IDENTIFICAÇÃO (2 POR PÁGINA: B14:O29 e Q14:AD29)
    // =========================================================================
    const pagePhotos = photos.slice(i * photosPerPage, (i + 1) * photosPerPage);

    // ------------------- FOTO 1 (ESQUERDA: B14) -------------------
    const f1 = pagePhotos[0];
    const f1Number = String(i * 2 + 1).padStart(2, '0');

    // Moldura externa da Foto 1
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.setFillColor(248, 248, 248);
    doc.rect(p1_x, photo_y, p1_w, photo_h, 'FD');

    if (f1) {
      try {
        const optF1 = await compressAndOptimizeImage(f1.dataUrl, 1280, 720, 0.75);
        doc.addImage(optF1, 'JPEG', p1_x + 0.5, photo_y + 0.5, p1_w - 1, photo_h - 1, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao renderizar Foto 1:', e);
      }
    }

    // Rodapé 1 (Linhas B30:O31)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p1_x, footer_y, p1_w, footer_h, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}`,
      p1_x + p1_w / 2,
      footer_y + 5.5,
      { align: 'center' }
    );
    doc.text(
      `Coordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`,
      p1_x + p1_w / 2,
      footer_y + 10.5,
      { align: 'center' }
    );

    // Faixa DESCRIÇÃO 1 (Linhas B32:O33)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p1_x, descHead_y, p1_w, descHead_h, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 0, 0); // Vermelho oficial do Excel
    doc.text('DESCRIÇÃO', p1_x + p1_w / 2, descHead_y + 5.5, { align: 'center' });

    // Caixa de Texto da Legenda 1 (Linhas B34:O37)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p1_x, descBody_y, p1_w, descBody_h, 'FD');

    // "Foto 01:" em vermelho negrito
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 0, 0);
    const prefix1 = `Foto ${f1Number}: `;
    doc.text(prefix1, p1_x + 3, descBody_y + 7);

    // Texto da legenda em preto
    if (f1 && f1.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      const prefixWidth = doc.getTextWidth(prefix1);
      doc.text(f1.descricao, p1_x + 3 + prefixWidth, descBody_y + 7, {
        maxWidth: p1_w - prefixWidth - 6
      });
    }

    // ------------------- FOTO 2 (DIREITA: Q14) -------------------
    const f2 = pagePhotos[1];
    const f2Number = String(i * 2 + 2).padStart(2, '0');

    // Moldura externa da Foto 2
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(248, 248, 248);
    doc.rect(p2_x, photo_y, p2_w, photo_h, 'FD');

    if (f2) {
      try {
        const optF2 = await compressAndOptimizeImage(f2.dataUrl, 1280, 720, 0.75);
        doc.addImage(optF2, 'JPEG', p2_x + 0.5, photo_y + 0.5, p2_w - 1, photo_h - 1, undefined, 'FAST');
      } catch (e) {
        console.error('Erro ao renderizar Foto 2:', e);
      }
    }

    // Rodapé 2 (Linhas Q30:AD31)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p2_x, footer_y, p2_w, footer_h, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}`,
      p2_x + p2_w / 2,
      footer_y + 5.5,
      { align: 'center' }
    );
    doc.text(
      `Coordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`,
      p2_x + p2_w / 2,
      footer_y + 10.5,
      { align: 'center' }
    );

    // Faixa DESCRIÇÃO 2 (Linhas Q32:AD33)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p2_x, descHead_y, p2_w, descHead_h, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(210, 0, 0);
    doc.text('DESCRIÇÃO', p2_x + p2_w / 2, descHead_y + 5.5, { align: 'center' });

    // Caixa de Texto da Legenda 2 (Linhas Q34:AD37)
    doc.setDrawColor(180, 180, 180);
    doc.setFillColor(255, 255, 255);
    doc.rect(p2_x, descBody_y, p2_w, descBody_h, 'FD');

    // "Foto 02:" em vermelho negrito
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 0, 0);
    const prefix2 = `Foto ${f2Number}: `;
    doc.text(prefix2, p2_x + 3, descBody_y + 7);

    // Texto da legenda em preto
    if (f2 && f2.descricao) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(0, 0, 0);
      const prefixWidth = doc.getTextWidth(prefix2);
      doc.text(f2.descricao, p2_x + 3 + prefixWidth, descBody_y + 7, {
        maxWidth: p2_w - prefixWidth - 6
      });
    }

    // Número da página discreto no canto inferior direito
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i + 1} de ${numPages}`, 282, 202, { align: 'right' });
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
