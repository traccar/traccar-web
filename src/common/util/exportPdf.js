import regularFont from '@expo-google-fonts/roboto/400Regular/Roboto_400Regular.ttf?url';
import boldFont from '@expo-google-fonts/roboto/500Medium/Roboto_500Medium.ttf?url';
import fetchOrThrow from './fetchOrThrow';

export default async (title, fileName, sheets, { deviceHeader }) => {
  const sections = [...sheets].filter(([, rows]) => rows.length);
  if (!sections.length) return;

  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const document = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  await Promise.all(
    [
      [regularFont, 'normal'],
      [boldFont, 'bold'],
    ].map(async ([url, style]) => {
      const response = await fetchOrThrow(url);
      const bytes = new Uint8Array(await response.arrayBuffer());
      const name = `Roboto-${style}.ttf`;
      document.addFileToVFS(name, Array.from(bytes, (byte) => String.fromCharCode(byte)).join(''));
      document.addFont(name, 'Roboto', style);
    }),
  );

  sections.forEach(([name, rows], index) => {
    if (index) document.addPage();
    const headers = Object.keys(rows[0]);
    autoTable(document, {
      head: [headers],
      body: rows.map((row) => headers.map((header) => String(row[header] ?? ''))),
      styles: { font: 'Roboto' },
      margin: { top: deviceHeader ? 60 : 76, right: 28, bottom: 28, left: 28 },
      willDrawPage: () => {
        document.setFont('Roboto', 'bold');
        document.setFontSize(12);
        document.text(title, 28, 40);
        if (!deviceHeader) {
          document.setFontSize(10);
          document.text(name, 28, 56);
        }
      },
    });
  });
  document.save(fileName);
};
