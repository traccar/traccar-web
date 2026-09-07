export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.default,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px ${theme.palette.primary.main}20`,
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: '40px',
        borderRadius: '8px',
        textTransform: 'none',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
        },
      }),
      sizeMedium: {
        height: '40px',
      },
      contained: ({ theme }) => ({
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: `0 4px 12px ${theme.palette.primary.main}25`,
        '&:hover': {
          boxShadow: `0 6px 20px ${theme.palette.primary.main}35`,
        },
      }),
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: 'small',
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.primary.dark,
        borderRadius: '6px',
        fontSize: '12px',
        padding: '8px 12px',
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
      head: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: '#ffffff',
        fontWeight: 600,
      }),
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '8px',
        boxShadow: theme.palette.mode === 'light' 
          ? '0 2px 8px rgba(45, 122, 99, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
      }),
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderRadius: '8px',
        backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : theme.palette.background.paper,
      }),
    },
  },
};
