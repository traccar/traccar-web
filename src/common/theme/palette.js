const validatedColor = (color) => (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color) ? color : null);

export default (server, darkMode) => ({
  mode: darkMode ? 'dark' : 'light',
  background: {
    default: darkMode ? '#090d16' : '#f8fafc',
    paper: darkMode ? '#111827' : '#ffffff',
  },
  primary: {
    main: validatedColor(server?.attributes?.colorPrimary) || (darkMode ? '#fb7185' : '#e11d48'),
    light: '#fb7185',
    dark: '#be123c',
    contrastText: '#ffffff',
  },
  secondary: {
    main: validatedColor(server?.attributes?.colorSecondary) || (darkMode ? '#34d399' : '#10b981'),
  },
  success: {
    main: '#10b981',
    light: '#d1fae5',
    dark: '#059669',
  },
  warning: {
    main: '#f59e0b',
    light: '#fef3c7',
    dark: '#d97706',
  },
  error: {
    main: '#ef4444',
    light: '#fee2e2',
    dark: '#dc2626',
  },
  neutral: {
    main: '#94a3b8',
    light: '#f1f5f9',
    dark: '#64748b',
  },
  text: {
    primary: darkMode ? '#f8fafc' : '#0f172a',
    secondary: darkMode ? '#94a3b8' : '#64748b',
  },
  divider: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
  action: {
    hover: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.04)',
    selected: darkMode ? 'rgba(225, 29, 72, 0.16)' : 'rgba(225, 29, 72, 0.08)',
  },
  geometry: {
    main: '#e11d48',
  },
});
