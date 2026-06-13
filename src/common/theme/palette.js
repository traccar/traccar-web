import { grey } from '@mui/material/colors';

const validatedColor = (color) =>
  /^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null;

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',

  background: {
    default: darkMode ? '#08111B' : '#F5F7FA',
    paper: darkMode ? '#0D1B2A' : '#FFFFFF',
  },

  primary: {
    main:
      validatedColor(server?.attributes?.colorPrimary) ||
      '#0D1B2A',
  },

  secondary: {
    main:
      validatedColor(server?.attributes?.colorSecondary) ||
      '#28A745',
  },

  success: {
    main: '#28A745',
  },

  info: {
    main: '#7ED957',
  },

  neutral: {
    main: '#6B7280',
  },

  geometry: {
    main: '#28A745',
  },

  alwaysDark: {
    main: '#0D1B2A',
  },

  text: {
    primary: darkMode ? '#FFFFFF' : '#0D1B2A',
    secondary: '#6B7280',
  },
});