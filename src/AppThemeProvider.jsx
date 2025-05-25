import { useSelector } from 'react-redux';
import { ThemeProvider, useMediaQuery } from '@mui/material';
import theme from './common/theme';
import { useLocalization } from './common/components/LocalizationProvider';

const AppThemeProvider = ({ children }) => {
  const server = useSelector((state) => state.session.server);
  const { direction } = useLocalization();

  const serverDarkMode = server?.attributes?.darkMode;
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const darkMode = serverDarkMode !== undefined ? serverDarkMode : preferDarkMode;

  const themeInstance = theme(server, darkMode, direction);

  return (
    <ThemeProvider theme={themeInstance}>
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
