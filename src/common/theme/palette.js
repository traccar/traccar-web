import { grey, green } from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#0f3d2f' : '#f5f9f7',
    paper: darkMode ? '#1a5140' : '#ffffff',
  },
  primary: {
    main:
      validatedColor(server?.attributes?.colorPrimary) || (darkMode ? green[100] : '#2d7a63'),
    light: '#4caf50',
    dark: '#1b5e3f',
    contrastText: '#ffffff',
  },
  secondary: {
    main:
      validatedColor(server?.attributes?.colorSecondary) || (darkMode ? green[300] : '#27a354'),
    light: '#66bb6a',
    dark: '#1e7e34',
    contrastText: '#ffffff',
  },
  neutral: {
    main: grey[500],
  },
  geometry: {
    main: '#27a354',
  },
  alwaysDark: {
    main: grey[900],
  },
});
