import {
  borderBottom,
  borderBottomColor,
  borderColor,
  darken,
} from "@mui/system";

export default {
  MuiUseMediaQuery: {
    defaultProps: {
      noSsr: true,
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiButton: {
    styleOverrides: {
      sizeMedium: {
        height: "40px",
      },
    },
  },
  MuiFormControl: {
    defaultProps: {
      size: "large",
    },
  },
  MuiSelect: {
    defaultProps: {},
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&.Mui-selected": {
          backgroundColor: darken(theme.palette.background.paper, 0.1),
        },
        "&.Mui-selected:hover": {
          backgroundColor: darken(theme.palette.background.paper, 0.4),
        },
      }),
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    },
  },
  MuiTooltip: {
    defaultProps: {
      enterDelay: 500,
      enterNextDelay: 500,
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      fontSizeLarge: {
        fontSize: "40px",
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderBottomColor: theme.palette.secondary.main,
      }),
    },
  },
};
