import { createMuiTheme } from '@material-ui/core/styles';

const traccarPurple = '#333366';
const traccarGreen = '#4CAF50';
const traccarWhite = '#FFF';

export default createMuiTheme({
  palette: {  
    common: {
      purple: traccarPurple,
      green: traccarGreen
    },
    primary: {
      main: traccarPurple
    },
    secondary: {
      main: traccarGreen,
      contrastText: traccarWhite
    }
  },
  overrides: {
    MuiFormControl: {
      root: {
        height: '42px',
      }
    },    
    MuiFilledInput: {
      root: {
        height: '42px',
        borderRadius: '4px'
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
        height: '42px',
      }
    }
  } 
});
