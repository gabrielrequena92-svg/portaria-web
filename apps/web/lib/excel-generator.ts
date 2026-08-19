import ExcelJS from 'exceljs';

export interface ReportPhoto {
  id: string;
  dataUrl: string; // Base64 data URL or blob URL
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

// Converte com segurança e valida qualquer imagem para ArrayBuffer binário limpo (PNG/JPEG)
async function ensureValidImageBuffer(urlOrData: string): Promise<{ buffer: ArrayBuffer; extension: 'png' | 'jpeg' } | null> {
  if (!urlOrData || typeof urlOrData !== 'string' || urlOrData.trim().length === 0) {
    return null;
  }

  // No navegador (Client Side), usamos Canvas para garantir formato binário PNG 100% válido
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            blob.arrayBuffer().then((buffer) => {
              resolve({ buffer, extension: 'png' });
            }).catch(() => resolve(null));
          }, 'image/png');
        } catch (e) {
          console.warn('Erro ao processar imagem no canvas:', e);
          resolve(null);
        }
      };
      img.onerror = (err) => {
        console.warn('Erro ao carregar imagem para o Excel:', err);
        resolve(null);
      };
      img.src = urlOrData;
    });
  }

  // Fallback para Node.js / Fetch direto
  try {
    if (urlOrData.startsWith('data:')) {
      const base64Data = urlOrData.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return { buffer: bytes.buffer as ArrayBuffer, extension: 'png' };
    }

    const response = await fetch(urlOrData);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return { buffer: arrayBuffer, extension: 'png' };
  } catch (e) {
    return null;
  }
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

// Mesclagens oficiais do modelo Relatorio_Modelo_OK.xlsx
const OFFICIAL_MERGES = [
  'A8:AC8',
  'E10:Z10',
  'B12:AD12',
  'B30:O31',
  'Q30:AD31',
  'B32:O33',
  'Q32:AD33',
  'B34:O34',
  'Q34:AD34',
  'B35:O35',
  'Q35:AD35',
  'B36:O36',
  'Q36:AD36',
  'B37:O37',
  'Q37:AD37'
];

export async function generateOfficialExcel(data: ReportData, photos: ReportPhoto[]) {
  // 1. Baixar o arquivo template original e os logos oficiais
  const [templateResp, logo1Resp, logo2Resp] = await Promise.all([
    fetch('/Relatorio_Modelo_OK.xlsx'),
    fetch('/template_assets/image1.png'),
    fetch('/template_assets/image2.png')
  ]);

  if (!templateResp.ok) {
    throw new Error('Não foi possível carregar o modelo Relatorio_Modelo_OK.xlsx');
  }

  const templateArrayBuffer = await templateResp.arrayBuffer();
  const logo1ArrayBuffer = logo1Resp.ok ? await logo1Resp.arrayBuffer() : null;
  const logo2ArrayBuffer = logo2Resp.ok ? await logo2Resp.arrayBuffer() : null;

  const totalPhotos = photos.length;
  const numPages = Math.ceil(totalPhotos / 2) || 1;

  // 2. Carregar o Workbook base
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(templateArrayBuffer);

  const templateSheet = workbook.worksheets[0];
  templateSheet.name = 'Relatorio_P1';

  // Registrar Logos Fixos no Workbook (usados para as abas 2 em diante)
  let logo1Id: number | null = null;
  let logo2Id: number | null = null;

  if (logo1ArrayBuffer) {
    logo1Id = workbook.addImage({
      buffer: logo1ArrayBuffer,
      extension: 'png',
    });
  }

  if (logo2ArrayBuffer) {
    logo2Id = workbook.addImage({
      buffer: logo2ArrayBuffer,
      extension: 'png',
    });
  }

  // Obra Logo (inserir apenas se houver imagem válida carregada)
  let logoObraId: number | null = null;
  if (data.logoObra && data.logoObra.trim().length > 0) {
    const validLogo = await ensureValidImageBuffer(data.logoObra);
    if (validLogo) {
      logoObraId = workbook.addImage({
        buffer: validLogo.buffer,
        extension: validLogo.extension,
      });
    }
  }

  // 3. Processar Cada Página / Aba
  for (let i = 0; i < numPages; i++) {
    let sheet = templateSheet;

    if (i > 0) {
      // Criar nova aba
      const newSheet = workbook.addWorksheet(`Relatorio_P${i + 1}`);

      // Replicar rigorosamente Visualização (ShowGridLines=false, Zoom, PageBreakPreview)
      newSheet.views = JSON.parse(JSON.stringify(templateSheet.views || []));

      // Replicar Configuração de Impressão (PageSetup, Margens, Orientação Paisagem, Área de Impressão)
      newSheet.pageSetup = JSON.parse(JSON.stringify(templateSheet.pageSetup || {}));

      // Replicar Propriedades da Planilha (Cores de Aba, Altura Padrão)
      newSheet.properties = JSON.parse(JSON.stringify(templateSheet.properties || {}));

      // Copiar larguras e estilos das colunas A até AE (1 a 35)
      for (let c = 1; c <= 35; c++) {
        const srcCol = templateSheet.getColumn(c);
        const destCol = newSheet.getColumn(c);
        destCol.width = srcCol.width;
        if (srcCol.style) {
          destCol.style = JSON.parse(JSON.stringify(srcCol.style));
        }
      }

      // Copiar todas as linhas, alturas e estilos de cada célula (1 a 40)
      for (let r = 1; r <= 40; r++) {
        const srcRow = templateSheet.getRow(r);
        const destRow = newSheet.getRow(r);
        destRow.height = srcRow.height;

        for (let c = 1; c <= 35; c++) {
          const srcCell = srcRow.getCell(c);
          const destCell = destRow.getCell(c);

          if (srcCell.value !== null && srcCell.value !== undefined) {
            destCell.value = srcCell.value;
          }
          if (srcCell.style) {
            destCell.style = JSON.parse(JSON.stringify(srcCell.style));
          }
        }
      }

      // Aplicar todas as mesclagens oficiais idênticas
      OFFICIAL_MERGES.forEach((range) => {
        try {
          newSheet.mergeCells(range);
        } catch (e) {
          // Ignora
        }
      });

      // Inserir Logos Fixos APENAS na aba 2 em diante (a aba 1 já tem os logos embutidos no modelo)
      if (logo1Id !== null) {
        try {
          newSheet.addImage(logo1Id, 'F4:L6');
        } catch (e) {
          console.warn('Erro ao inserir logo 1:', e);
        }
      }

      if (logo2Id !== null) {
        try {
          newSheet.addImage(logo2Id, 'T1:Y7');
        } catch (e) {
          console.warn('Erro ao inserir logo 2:', e);
        }
      }

      sheet = newSheet;
    }

    // Inserir Logo da Obra estritamente no intervalo O2:Q6 apenas se for imagem válida
    if (logoObraId !== null) {
      try {
        sheet.addImage(logoObraId, 'O2:Q6');
      } catch (e) {
        console.warn('Erro ao inserir logo da obra em O2:Q6:', e);
      }
    }

    // --- Preencher Textos Principais ---
    sheet.getCell('A8').value = '       RELATÓRIO FOTOGRÁFICO ORGANIZAÇÃO ARRUMAÇÃO E LIMPEZA DA OBRA';
    sheet.getCell('E10').value = data.dataRef;
    sheet.getCell('B12').value = `Obra: ${data.obraNome.toUpperCase()}`;

    // --- Preencher Rodapé ---
    const footerText = `Obra: ${data.obraNome.toUpperCase()} - Engenheiro Resp.: ${data.engenheiro || 'Jacqueline Correia'}\nCoordenador Resp.: ${data.coordenador || 'Guilherme Quadros'}`;
    sheet.getCell('B30').value = footerText;
    sheet.getCell('Q30').value = footerText;

    // --- Inserir Foto 1 (Esquerda: B14:O29) ---
    const p1Index = i * 2;
    if (p1Index < totalPhotos) {
      const p1 = photos[p1Index];
      sheet.getCell('B32').value = 'DESCRIÇÃO';
      sheet.getCell('B34').value = `Foto ${String(p1Index + 1).padStart(2, '0')}:`;
      sheet.getCell('B35').value = p1.descricao || '';

      const validP1 = await ensureValidImageBuffer(p1.dataUrl);
      if (validP1) {
        try {
          const imgId1 = workbook.addImage({
            buffer: validP1.buffer,
            extension: validP1.extension,
          });
          sheet.addImage(imgId1, 'B14:O29');
        } catch (e) {
          console.error('Erro ao adicionar foto 1 na planilha:', e);
        }
      }
    }

    // --- Inserir Foto 2 (Direita: Q14:AD29) ---
    const p2Index = i * 2 + 1;
    if (p2Index < totalPhotos) {
      const p2 = photos[p2Index];
      sheet.getCell('Q32').value = 'DESCRIÇÃO';
      sheet.getCell('Q34').value = `Foto ${String(p2Index + 1).padStart(2, '0')}:`;
      sheet.getCell('Q35').value = p2.descricao || '';

      const validP2 = await ensureValidImageBuffer(p2.dataUrl);
      if (validP2) {
        try {
          const imgId2 = workbook.addImage({
            buffer: validP2.buffer,
            extension: validP2.extension,
          });
          sheet.addImage(imgId2, 'Q14:AD29');
        } catch (e) {
          console.error('Erro ao adicionar foto 2 na planilha:', e);
        }
      }
    }
  }

  // 4. Gerar Buffer e Baixar Arquivo com a identificação da semana
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const cleanName = data.obraNome.replace(/\s+/g, '_') || 'Relatorio';
  const weekTag = extractWeekTag(data.dataRef);
  const fileName = `Relatorio_${cleanName}_${weekTag}.xlsx`;
  
  if (typeof window !== 'undefined') {
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  }

  return {
    buffer,
    blob,
    fileName
  };
}
