import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

export default (server, darkMode, direction) =>
  useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: 'Poppins, sans-serif',
          h1: {
            fontWeight: 700,
            color: '#0D1B2A',
          },

          h2: {
            fontWeight: 700,
            color: '#0D1B2A',
          },

          h3: {
            fontWeight: 600,
            color: '#0D1B2A',
          },

          h4: {
            fontWeight: 600,
            color: '#0D1B2A',
          },

          h5: {
            fontWeight: 600,
            color: '#0D1B2A',
          },

          h6: {
            fontWeight: 600,
            color: '#0D1B2A',
          },

          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
        palette: palette(server, darkMode),
        direction,
        dimensions,
        components,
      }),
    [server, darkMode, direction],
  );
