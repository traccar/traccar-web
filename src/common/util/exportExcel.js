import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const borderDefinition = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

const exportExcel = async (title, fileName, sheets, theme) => {
  if (sheets.size === 0) {
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const headerColor = `FF${theme.palette.primary.main.replace('#', '').toUpperCase()}`;

  sheets.forEach((rows, sheetTitle) => {
    const worksheet = workbook.addWorksheet(sheetTitle);
    const headers = Object.keys(rows[0]);

    const titleRow = worksheet.addRow([title]);
    if (headers.length > 1) {
      worksheet.mergeCells(1, 1, 1, headers.length);
    }
    titleRow.font = { bold: true };

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.border = borderDefinition;
      cell.font = {};
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: headerColor },
      };
    });

    rows.forEach((item) => {
      const values = headers.map((header) => item[header]);
      const row = worksheet.addRow(values);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = borderDefinition;
        cell.font = {};
      });
    });
  });

  const blob = new Blob(
    [await workbook.xlsx.writeBuffer()],
    { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  );
  saveAs(blob, fileName);
};

export default exportExcel;
