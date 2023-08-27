import { useMediaQuery } from '@mui/material';
import {
  amber, grey, green, indigo, red,
} from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server) => {
  const preferDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const serverDarkMode = server?.attributes?.darkMode;
  const darkMode = serverDarkMode !== undefined ? serverDarkMode : preferDarkMode;

  const colors = {
    primary: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? indigo[200] : indigo[900]),
    secondary: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? green[200] : green[800]),
    positive: green[500],
    medium: amber[700],
    negative: red[500],
    neutral: grey[500],
    geometry: '#3bb2d0',
  };

  return {
    mode: darkMode ? 'dark' : 'light',
    background: {
      default: darkMode ? grey[900] : grey[50],
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    colors,
  };
};
