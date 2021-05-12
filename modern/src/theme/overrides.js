import dimensions from './dimensions';

export default {
  MuiFormControl: {
    root: {
      height: dimensions.inputHeight,
    }
  },
  MuiInputLabel: {
    filled: {
      transform: 'translate(12px, 14px) scale(1)',
        '&$shrink' :{
          transform: 'translate(12px, -12px) scale(0.75)'
        }
    },
  },      
  MuiFilledInput: {
    root: {
      height: dimensions.inputHeight,
      borderRadius: dimensions.borderRadius,
      background: 'rgba(0, 0, 0, 0.035)',
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
      "&:before": {
        borderBottom: 'none',
      },
      "&:after": {
        borderBottom: 'none',
      },
      "&:hover:before": {
        borderBottom: 'none',
      },             
    }
  },
  MuiButton: {
    root: {
      height: dimensions.inputHeight,
    }
  }
};
