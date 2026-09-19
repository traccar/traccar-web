export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 12,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.25)' : '#94a3b8',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.primary.main,
          borderWidth: 1.5,
        },
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 600,
        textTransform: 'none',
        letterSpacing: '0.01em',
      },
      sizeMedium: {
        height: '42px',
      },
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
};
