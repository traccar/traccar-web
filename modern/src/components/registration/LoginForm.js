import React, { useState } from 'react';
import {
  Grid, useMediaQuery, makeStyles, InputLabel, Select, MenuItem, FormControl, Button, TextField, Link,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from '../../store';
import t from '../../common/localization';
import StartPage from '../../StartPage';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  resetPassword: {
    cursor: 'pointer',
  },
}));

const LoginForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registrationEnabled = useSelector((state) => (state.session.server ? state.session.server.registration : false));
  const emailEnabled = useSelector((state) => (state.session.server ? state.session.server.emailEnabled : false));

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

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
  };

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handleLogin(e);
    }
  };

  return (
    <StartPage>
      <Grid container direction="column" spacing={2}>
        {useMediaQuery(theme.breakpoints.down('md'))
          && (
          <Grid item className={classes.logoContainer}>
            <svg height="64" width="240">
              <use xlinkHref="/logo.svg#img" />
            </svg>
          </Grid>
          )}
        <Grid item>
          <TextField
            required
            fullWidth
            error={failed}
            label={t('userEmail')}
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={handleEmailChange}
            onKeyUp={handleSpecialKey}
            helperText={failed && 'Invalid username or password'}
            variant="filled"
          />
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            error={failed}
            label={t('userPassword')}
            name="password"
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            onKeyUp={handleSpecialKey}
            variant="filled"
          />
        </Grid>
        <Grid item>
          <Button
            onClick={handleLogin}
            onKeyUp={handleSpecialKey}
            variant="contained"
            color="secondary"
            disabled={!email || !password}
            fullWidth
          >
            {t('loginLogin')}
          </Button>
        </Grid>
        <Grid item container>
          <Grid item>
            <Button onClick={() => history.push('/register')} disabled={!registrationEnabled} color="secondary">
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
        {emailEnabled && (
        <Grid item container justify="flex-end">
          <Grid item>
            <Link onClick={() => history.push('/reset-password')} className={classes.resetPassword} underline="none">{t('loginReset')}</Link>
          </Grid>
        </Grid>
        )}
      </Grid>
    </StartPage>
  );
};

export default LoginForm;
