export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.default,
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      sizeMedium: {
        height: '40px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      // No white overlay on elevated surfaces in dark mode: panels use the palette color as-is
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        fontWeight: 600,
      },
    },
  },
  MuiAppBar: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        borderColor: theme.palette.divider,
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
  },
  MuiTableCell: {
    styleOverrides: {
      head: ({ theme }) => ({
        fontWeight: 600,
        color: theme.palette.text.secondary,
      }),
      root: ({ theme }) => ({
        '@media print': {
          color: theme.palette.alwaysDark.main,
        },
      }),
    },
  },
};
