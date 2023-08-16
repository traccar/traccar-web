import {
  amber, grey, green, red, orange, common,
} from '@mui/material/colors';

const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server) => {
  const colors = {
    white: common.white,
    background: grey[50],
    primary: validatedColor(server?.attributes?.colorPrimary) || orange[500],
    secondary: validatedColor(server?.attributes?.colorSecondary) || green[500],
    positive: green[500],
    medium: amber[700],
    negative: red[500],
    neutral: grey[500],
    geometry: red[900],
    ignition: green[800],
  };

  return {
    background: {
      default: colors.background,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.white,
    },
    colors,
  };
};
