import React, { useState } from 'react';
import {
  Grid, useMediaQuery, makeStyles, InputLabel, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, IconButton, Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CachedIcon from '@material-ui/icons/Cached';
import { useTheme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';

const useStyles = makeStyles((theme) => ({
  legacy: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  logoContainer: {
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  resetPassword: {
    cursor: 'pointer',
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');

  const registrationEnabled = useSelector((state) => state.session.server?.registration);
  const emailEnabled = useSelector((state) => state.session.server?.emailEnabled);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server?.announcement);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
      });
      if (response.ok) {
        const user = await response.json();
        dispatch(sessionActions.updateUser(user));
        history.push('/');
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setFailed(true);
      setPassword('');
    }
  };

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handleSubmit(e);
    }
  };

  return (
    <LoginLayout>
      <Tooltip title="Switch to Legacy App" className={classes.legacy}>
        <IconButton onClick={() => window.localStorage.setItem('legacyApp', true) || window.location.replace('/')}>
          <CachedIcon />
        </IconButton>
      </Tooltip>
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
            autoFocus={!email}
            onChange={(e) => setEmail(e.target.value)}
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
            autoFocus={!!email}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={handleSpecialKey}
            variant="filled"
          />
        </Grid>
        <Grid item>
          <Button
            onClick={handleSubmit}
            onKeyUp={handleSpecialKey}
            variant="contained"
            color="secondary"
            disabled={!email || !password}
            fullWidth
          >
            {t('loginLogin')}
          </Button>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item>
            <Button onClick={() => history.push('/register')} disabled={!registrationEnabled} color="secondary">
              {t('loginRegister')}
            </Button>
          </Grid>
          <Grid item xs>
            <FormControl variant="filled" fullWidth>
              <InputLabel>{t('loginLanguage')}</InputLabel>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {emailEnabled && (
          <Grid item container justifyContent="flex-end">
            <Grid item>
              <Link onClick={() => history.push('/reset-password')} className={classes.resetPassword} underline="none">{t('loginReset')}</Link>
            </Grid>
          </Grid>
        )}
        <Snackbar
          open={!!announcement && !announcementShown}
          message={announcement}
          action={(
            <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        />
      </Grid>
    </LoginLayout>
  );
};

export default LoginPage;
