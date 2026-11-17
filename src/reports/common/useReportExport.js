import { useTheme } from '@mui/material/styles';
import exportExcel from '../../common/util/exportExcel';
import exportPdf from '../../common/util/exportPdf';

export default () => {
  const theme = useTheme();

  return async (title, fileName, sheets, options) => {
    if (options.format === 'pdf') {
      await exportPdf(`${fileName}.pdf`, sheets, options);
    } else {
      await exportExcel(title, `${fileName}.xlsx`, sheets, theme);
    }
  };
};
