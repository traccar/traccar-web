import { deepPurple, green } from '@material-ui/core/colors';

const traccarPurple = deepPurple[500];
const traccarGreen = green[500];
const traccarWhite = '#FFF';

export default {
  common: {
    purple: traccarPurple,
    green: traccarGreen
  },
  primary: {
    main: traccarPurple
  },
  secondary: {
    main: traccarGreen,
    contrastText: traccarWhite
  }
};
