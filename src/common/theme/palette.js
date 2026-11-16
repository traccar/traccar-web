const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

// "Signal" palette. Status colors differ in lightness as well as hue,
// and text colors keep at least 4.5:1 contrast on their backgrounds.
const tokens = {
  light: {
    ground: '#F4F5F7',
    surface: '#FFFFFF',
    ink: '#111827',
    muted: '#4B5563',
    line: '#E5E7EB',
    accent: '#2563EB',
    strong: '#111827',
    info: '#2563EB',
    success: '#15803D',
    warning: '#C2410C',
    error: '#B91C1C',
    neutral: '#6B7280',
  },
  dark: {
    ground: '#0B1220',
    surface: '#111827',
    ink: '#F3F4F6',
    muted: '#9CA3AF',
    line: '#1F2937',
    accent: '#60A5FA',
    strong: '#E5E7EB',
    info: '#60A5FA',
    success: '#4ADE80',
    warning: '#FB923C',
    error: '#F87171',
    neutral: '#9CA3AF',
  },
};

export default (server, darkMode) => {
  const c = darkMode ? tokens.dark : tokens.light;
  return {
    mode: darkMode ? 'dark' : 'light',
    background: {
      default: c.ground,
      paper: c.surface,
    },
    text: {
      primary: c.ink,
      secondary: c.muted,
    },
    divider: c.line,
    primary: {
      main: validatedColor(server?.attributes?.colorPrimary) || c.accent,
    },
    secondary: {
      main: validatedColor(server?.attributes?.colorSecondary) || c.strong,
    },
    info: { main: c.info },
    success: { main: c.success },
    warning: { main: c.warning },
    error: { main: c.error },
    neutral: {
      main: c.neutral,
    },
    geometry: {
      main: '#3bb2d0',
    },
    alwaysDark: {
      main: '#111827',
    },
  };
};
