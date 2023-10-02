import React from 'react';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  googleButton: {
    backgroundColor: '#fff',
    color: theme.palette.getContrastText('#fff'), // Define a cor do texto com base no background
    '&:hover': {
      backgroundColor: '#f1f3f4', // Cor do background ao passar o mouse
    },
    textTransform: 'none', // Evita transformação de texto em maiúsculas
    fontWeight: 'bold',
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: theme.spacing(1),
    color: '#4285F4',
  },
}));

const GoogleLoginButton = () => {
  const classes = useStyles();

  const handleGoogleLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  return (
    <Button
      variant="contained"
      className={classes.googleButton}
      onClick={handleGoogleLogin}
      startIcon={<GoogleIcon className={classes.googleIcon} />}
    >
      Fazer login com Google
    </Button>
  );
};

export default GoogleLoginButton;
