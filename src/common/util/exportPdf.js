import regularFont from '@expo-google-fonts/roboto/400Regular/Roboto_400Regular.ttf?url';
import boldFont from '@expo-google-fonts/roboto/700Bold/Roboto_700Bold.ttf?url';
import fetchOrThrow from './fetchOrThrow';

export default async (fileName, sheets, { showDeviceHeader = true }) => {
  const sections = [...sheets].filter(([, rows]) => rows.length);
  if (!sections.length) return;

  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const pdf = new jsPDF({
    compress: true,
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  });
  await Promise.all(
    [
      [regularFont, 'normal'],
      [boldFont, 'bold'],
    ].map(async ([url, style]) => {
      const response = await fetchOrThrow(url);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const name = `Roboto-${style}.ttf`;
      pdf.addFileToVFS(name, Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
      pdf.addFont(name, 'Roboto', style);
    }),
  );

  sections.forEach(([name, rows], index) => {
    if (index) pdf.addPage();
    const headers = Object.keys(rows[0]);
    autoTable(pdf, {
      head: [...(showDeviceHeader ? [[{ content: name, colSpan: headers.length }]] : []), headers],
      body: rows.map((row) => headers.map((header) => String(row[header] ?? ''))),
      styles: { font: 'Roboto' },
    });
  });
  pdf.save(fileName);
};
