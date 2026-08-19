const ExcelJS = require('exceljs');
const path = require('path');

async function inspectImages() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.join(__dirname, 'public', 'Relatorio_Modelo_OK.xlsx'));
  const sheet = wb.worksheets[0];
  
  const images = sheet.getImages();
  for (const img of images) {
    console.log('Image ID:', img.imageId, 'TL:', img.range.tl, 'BR:', img.range.br);
    const media = wb.getImage(img.imageId);
    console.log('Media extension:', media.extension, 'name:', media.name);
  }
}

inspectImages().catch(console.error);
