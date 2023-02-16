import {
  amber, grey, green, red, orange, common,
} from '@mui/material/colors';

const colors = {
  white: common.white,
  background: grey[50],
<<<<<<< HEAD
  primary: orange[500],
  secondary: green[500],
=======
  primary: indigo[900],
  secondary: green[800],
>>>>>>> upstream/master
  positive: green[500],
  medium: amber[700],
  negative: red[500],
  neutral: grey[500],
  geometry: red[900],
};

export default {
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
