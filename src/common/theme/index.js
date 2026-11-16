import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

const bodyFont = '"Inter Variable",Inter,Roboto,"Segoe UI","Helvetica Neue",Arial,sans-serif';
const headingFont = `"Space Grotesk Variable","Space Grotesk",${bodyFont}`;

const heading = { fontFamily: headingFont, fontWeight: 600, letterSpacing: '-0.01em' };

// Soft, slate-tinted shadows instead of Material's default grey ones
const shadows = (darkMode) => {
  const tint = darkMode ? '0,0,0' : '15,23,42';
  return Array.from({ length: 25 }, (_, level) => {
    if (level === 0) return 'none';
    if (level === 1) return `0 1px 2px rgba(${tint},0.08)`;
    if (level <= 3) return `0 2px 8px rgba(${tint},0.12)`;
    if (level <= 8) return `0 8px 24px rgba(${tint},0.14)`;
    return `0 12px 32px rgba(${tint},0.18)`;
  });
};

export default (server, darkMode, direction) =>
  useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: bodyFont,
          h1: heading,
          h2: heading,
          h3: heading,
          h4: heading,
          h5: heading,
          h6: heading,
          button: { textTransform: 'none', fontWeight: 600 },
          overline: { fontWeight: 600, letterSpacing: '0.06em' },
        },
        shape: {
          borderRadius: 12,
        },
        shadows: shadows(darkMode),
        palette: palette(server, darkMode),
        direction,
        dimensions,
        components,
      }),
    [server, darkMode, direction],
  );
