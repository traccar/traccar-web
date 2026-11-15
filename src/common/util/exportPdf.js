import { formatTime } from './formatter';

const textColumns = new Set([
  'deviceId',
  'address',
  'startAddress',
  'endAddress',
  'driverName',
  'type',
  'attributes',
  'geofenceId',
  'maintenanceId',
]);
const dateColumns = new Set(['startTime', 'endTime', 'eventTime']);

const pageMargin = 28;
const cellPadding = 4;

const loadLogo = async (url) => {
  if (!url) return null;
  try {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = Math.max(1, Math.round((600 * image.naturalHeight) / image.naturalWidth));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return null;
  }
};

export default async (
  title,
  fileName,
  sheets,
  server,
  { from, to, columns, deviceHeader, landscape = false },
) => {
  const sections = [...sheets].filter(([, rows]) => rows.length);
  if (!sections.length) return;
  const [{ default: pdfMake }, { default: fonts }] = await Promise.all([
    import('pdfmake/build/pdfmake'),
    import('pdfmake/build/vfs_fonts'),
  ]);
  pdfMake.addVirtualFileSystem(fonts);
  const font = new FontFace(
    'ReportRoboto',
    `url(data:font/ttf;base64,${fonts['Roboto-Regular.ttf']})`,
  );
  const boldFont = new FontFace(
    'ReportRoboto',
    `url(data:font/ttf;base64,${fonts['Roboto-Medium.ttf']})`,
    { weight: 'bold' },
  );
  await Promise.all([font.load(), boldFont.load()]);
  document.fonts.add(font);
  document.fonts.add(boldFont);
  try {
    const measure = document.createElement('canvas').getContext('2d');
    measure.font = '10px ReportRoboto';
    const width = (value) => measure.measureText(value).width;
    const logo = await loadLogo(server.attributes?.logo);
    const start = new Date(from);
    const end = new Date(to);
    const fullDays =
      start.getHours() === 0 &&
      start.getMinutes() === 0 &&
      end.getHours() === 23 &&
      end.getMinutes() === 59;
    const period = `${formatTime(from, fullDays ? 'date' : 'minutes')} - ${formatTime(to, fullDays ? 'date' : 'minutes')}`;
    const content = [];
    sections.forEach(([name, rows], sectionIndex) => {
      const headers = Object.keys(rows[0]);
      const keys = deviceHeader ? ['deviceId', ...columns] : columns;
      const values = rows.map((row) =>
        headers.map((header, i) => {
          const value = String(row[header] ?? '');
          return dateColumns.has(keys[i]) ? value.replace(/,?\s+(\d{1,2}:\d{2})/, '\n$1') : value;
        }),
      );
      const available =
        (landscape ? 841.89 : 595.28) - 2 * pageMargin - headers.length * 2 * cellPadding;
      const widths = keys.map((key, i) =>
        textColumns.has(key)
          ? 40
          : values.reduce(
              (maximum, row) =>
                row[i]
                  .split('\n')
                  .reduce((lineMaximum, line) => Math.max(lineMaximum, width(line)), maximum),
              28,
            ),
      );
      let remaining = available - widths.reduce((sum, value) => sum + value, 0);
      // Keep portrait pages and readable font size. Long selections wrap rather than losing data.
      if (remaining < 0) {
        widths.forEach((value, i) => {
          widths[i] = (value * available) / (available - remaining);
        });
      } else {
        measure.font = 'bold 10px ReportRoboto';
        const extra = headers.map((header, i) =>
          Math.max(0, ...header.split(/\s+/).map((word) => width(word) + 1 - widths[i])),
        );
        measure.font = '10px ReportRoboto';
        const totalExtra = extra.reduce((sum, value) => sum + value, 0);
        const scale = totalExtra ? Math.min(1, remaining / totalExtra) : 0;
        widths.forEach((value, i) => {
          widths[i] = value + extra[i] * scale;
        });
        remaining -= totalExtra * scale;
        const flexible = keys
          .map((key, i) => (textColumns.has(key) ? i : -1))
          .filter((i) => i >= 0);
        const targets = flexible.length ? flexible : keys.map((_, i) => i);
        targets.forEach((i) => {
          widths[i] += remaining / targets.length;
        });
      }
      const heading = headers.map((header) => ({
        text: header,
        bold: true,
        color: '#233d4d',
        fillColor: '#dfe8ee',
      }));
      const sectionHeading = [
        {
          colSpan: headers.length,
          stack: [
            { text: title, fontSize: 12, bold: true, margin: [0, 0, 0, 10] },
            {
              columns: [
                { text: deviceHeader ? '' : name, bold: true },
                { text: period, alignment: 'right' },
              ],
            },
          ],
          margin: [0, 0, 0, 6],
        },
        ...headers.slice(1).map(() => ({})),
      ];
      const tableRows = values.map((row) =>
        row.map((value, i) => ({
          text: value,
          alignment: textColumns.has(keys[i]) || dateColumns.has(keys[i]) ? 'left' : 'right',
          fillColor: i % 2 ? '#f1f4f6' : '#ffffff',
        })),
      );
      content.push({
        pageBreak: sectionIndex ? 'before' : undefined,
        table: {
          headerRows: 2,
          dontBreakRows: true,
          widths,
          body: [sectionHeading, heading, ...tableRows],
        },
        layout: {
          hLineWidth: (i) => (i < 2 ? 0 : 0.4),
          vLineWidth: () => 0,
          hLineColor: () => '#c8d4dc',
          paddingLeft: () => cellPadding,
          paddingRight: () => cellPadding,
          paddingTop: () => 6,
          paddingBottom: () => 6,
        },
      });
    });
    await pdfMake
      .createPdf({
        pageSize: 'A4',
        pageOrientation: landscape ? 'landscape' : 'portrait',
        pageMargins: [pageMargin, 78, pageMargin, 36],
        defaultStyle: { font: 'Roboto', fontSize: 10 },
        info: { title },
        header: {
          margin: [pageMargin, 20, pageMargin, 0],
          columns: [
            {
              text: server.attributes?.title || '',
              bold: true,
              color: '#5f6b73',
              margin: [0, 12, 0, 0],
            },
            ...(logo ? [{ image: logo, fit: [142, 40], width: 142 }] : []),
          ],
        },
        footer: (page) => ({
          text: String(page),
          alignment: 'right',
          margin: [pageMargin, 12, pageMargin, 0],
          fontSize: 8,
          color: '#5f6b73',
        }),
        content,
      })
      .download(fileName);
  } finally {
    document.fonts.delete(font);
    document.fonts.delete(boldFont);
  }
};
