import React, { useState } from 'react';
import { Grid, Button, TextField, Typography, Link, makeStyles, Snackbar } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LoginForm from './LoginForm';
import t from './../../common/localization';

const useStyles = makeStyles(theme => ({
  register: {
    fontSize: theme.spacing(3),
    fontWeight: 500
  },
  link: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginTop: theme.spacing(0.5),
    cursor: 'pointer' 
  }
}));

const forms = {
  login: () => LoginForm,
};

const RegisterForm = ({ setCurrentForm }) => {

  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const submitDisabled = () => {
    return !name || !/(.+)@(.+)\.(.{2,})/.test(email) || !password;
  }

  const handleRegister = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name, email, password})
    });

    if (response.ok) {
      setSnackbarOpen(true);
    } 
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={() => setCurrentForm(forms.login)}
        autoHideDuration={6000}
        message={t('loginCreated')} />    
      <Grid container direction='column' spacing={3}>
        <Grid container item>
          <Grid item>
            <Typography className={classes.link} color='primary'>
              <Link onClick={() => setCurrentForm(forms.login)}>
                <ArrowBackIcon />
              </Link>
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography className={classes.register} color='primary'>
              {t('loginRegister')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            label={t('sharedName')}
            name='name'
            value={name || ''}
            autoComplete='name'
            autoFocus
            onChange={event => setName(event.target.value)}
            variant='filled' />        
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            type='email' 
            label={t('userEmail')}
            name='email'
            value={email || ''}
            autoComplete='email'
            onChange={event => setEmail(event.target.value)}
            variant='filled' />
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            label={t('userPassword')}
            name='password'
            value={password || ''}
            type='password'
            autoComplete='current-password'
            onChange={event => setPassword(event.target.value)}
            variant='filled' />
        </Grid>
        <Grid item>
          <Button
            variant='contained' 
            color="secondary" 
            onClick={handleRegister} 
            disabled={submitDisabled()}
            fullWidth>
              {t('loginRegister')}
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default RegisterForm;
