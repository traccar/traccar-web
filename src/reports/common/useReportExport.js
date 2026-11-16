import { useTheme } from '@mui/material/styles';
import exportExcel from '../../common/util/exportExcel';

export default () => {
  const theme = useTheme();

  return async (title, fileName, sheets, options) => {
    if (options.format === 'pdf') {
      const { default: exportPdf } = await import('../../common/util/exportPdf');
      await exportPdf(title, fileName.replace(/\.xlsx$/, '.pdf'), sheets, options);
    } else {
      await exportExcel(title, fileName, sheets, theme);
    }
  };
};
