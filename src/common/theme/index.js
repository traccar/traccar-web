import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

export default (server, darkMode, direction) => useMemo(() => createTheme({
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  palette: palette(server, darkMode),
  direction,
  dimensions,
  components,
}), [server, darkMode, direction]);
