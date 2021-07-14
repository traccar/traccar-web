import dimensions from './dimensions';

export default {
  MuiFormControl: {
    root: {
      marginTop: 5,
      marginBottom: 5,
    },
  },
  MuiInputLabel: {
    filled: {
      transform: 'translate(12px, 14px) scale(1)',
      '&$shrink': {
        transform: 'translate(12px, -14px) scale(0.72)',
      },
    },
  },
  MuiFilledInput: {
    root: {
      height: dimensions.inputHeight,
      borderRadius: dimensions.borderRadius,
      backgroundColor: 'rgba(0, 0, 0, 0.035)',
    },
    input: {
      height: dimensions.inputHeight,
      borderRadius: dimensions.borderRadius,
      paddingTop: '10px',
      boxSizing: 'border-box',
      '&:-webkit-autofill': {
        WebkitBoxShadow: '0 0 0 100px #eeeeee inset',
      },
    },
    underline: {
      '&:before': {
        borderBottom: 'none',
      },
      '&:after': {
        borderBottom: 'none',
      },
      '&:hover:before': {
        borderBottom: 'none',
      },
    },
  },
  MuiButton: {
    root: {
      height: dimensions.inputHeight,
      marginTop: 5,
      marginBottom: 5,
      '&$disabled': {
        opacity: 0.4,
        color: undefined,
      },
    },
    contained: {
      '&$disabled': {
        opacity: 0.4,
        color: undefined,
        backgroundColor: undefined,
      },
    },
  },
  MuiFormHelperText: {
    root: {
      marginBottom: -10,
    },
    contained: {
      marginLeft: 12,
    },
  },
  MuiAutocomplete: {
    inputRoot: {
      '&.MuiFilledInput-root': {
        paddingTop: 0,
      },
    },
  },
};
