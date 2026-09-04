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
          fontFamily: 'Roboto,Segoe UI,Helvetica Neue,Arial,sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.5px',
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 700,
            letterSpacing: '-0.3px',
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 600,
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 600,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: '1.5',
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: '1.43',
          },
          button: {
            fontWeight: 600,
            letterSpacing: '0.5px',
          },
        },
        palette: palette(server, darkMode),
        direction,
        dimensions,
        components,
        shape: {
          borderRadius: 8,
        },
      }),
    [server, darkMode, direction],
  );
