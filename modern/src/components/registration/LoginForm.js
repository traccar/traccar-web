import React, { useState } from 'react';
import { Grid, useMediaQuery, makeStyles, InputLabel, Select, MenuItem, FormControl, Button, TextField, Link } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from '../../store';
import t from '../../common/localization';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';

const useStyles = makeStyles(theme => ({
  logoContainer: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  resetPassword: {
    cursor: 'pointer',
  }
}));

const forms = {
  register: () => RegisterForm,
  resetPassword: () => ResetPasswordForm,
};

const LoginForm = ({ setCurrentForm }) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registrationEnabled =  useSelector(state => state.session.server ? state.session.server['registration'] : false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) });
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      history.push('/');
    } else {
      setFailed(true);
      setPassword('');
    }
  }

  return (
    <Grid container direction='column' spacing={3}>
      {useMediaQuery(theme.breakpoints.down('md')) &&
        <Grid item className={classes.logoContainer}>
          <svg height="64" width="240">
            <use xlinkHref="/logo.svg#img"></use>
          </svg>
        </Grid>
      }
      <Grid item>
        <TextField
          required
          fullWidth
          error={failed}
          label={t('userEmail')}
          name='email'
          value={email}
          autoComplete='email'
          autoFocus
          onChange={handleEmailChange}
          helperText={failed && 'Invalid username or password'}
          variant='filled' />
      </Grid>
      <Grid item>
        <TextField
          required
          fullWidth
          error={failed}
          label={t('userPassword')}
          name='password'
          value={password}
          type='password'
          autoComplete='current-password'
          onChange={handlePasswordChange}
          variant='filled' />
      </Grid>
      <Grid item>
        <Button 
          onClick={handleLogin}
          variant='contained' 
          color='secondary'
          disabled={!email || !password}
          fullWidth>
          {t('loginLogin')}
        </Button>
      </Grid>
      <Grid item container>
        <Grid item>
          <Button onClick={() => setCurrentForm(forms.register)} disabled={!registrationEnabled} color="secondary">
            {t('loginRegister')}
          </Button>
        </Grid>
        <Grid item xs>
          <FormControl variant="filled" fullWidth>
            <InputLabel>{t('loginLanguage')}</InputLabel>
            <Select>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item container justify="flex-end">
        <Grid item>
          <Link onClick={() => setCurrentForm(forms.resetPassword)} className={classes.resetPassword} underline="none">{t('loginReset')}</Link>              
        </Grid>
      </Grid>            
    </Grid>
  )
}

export default LoginForm;
