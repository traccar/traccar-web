import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  useMediaQuery, InputLabel, Select, MenuItem, FormControl, Button, TextField, Link, Snackbar, IconButton, LinearProgress, FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
// import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import secureLocalStorage from 'react-secure-storage';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import { handleLoginTokenListeners, nativeEnvironment, nativePostMessage } from '../common/components/NativeInterface';
import LogoImage from './LogoImage';
import { useCatch } from '../reactHelper';
import GoogleLoginButton from './GoogleLoginButton';

const useStyles = makeStyles((theme) => ({
  options: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  extraContainer: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  registerButton: {
    minWidth: 'unset',
  },
  resetPassword: {
    color: '#757575',
    fontWeight: '500',
    fontSize: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
    borderRadius: '1px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px 0 rgb(0 0 0 / 25%)',
    transition: '.4s',
    marginTop: theme.spacing(1),
    padding: '0.8rem',
    '&:hover': {
      boxShadow: '0 0 3px 3px rgb(66 133 244 / 30%)',
    },
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const [failed, setFailed] = useState(false);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe') === 'true');

  // lembrar-me inicio
  const [checked, setChecked] = useState(rememberMe || false);

  // lembrar-me
  const handleChange = (event) => {
    const { checked } = event.target;
    setChecked(checked);
    setRememberMe(checked);
    localStorage.setItem('rememberMe', checked);
  };

  const handleStoreCredentials = () => {
    if (checked) {
      secureLocalStorage.setItem('email', email);
      secureLocalStorage.setItem('password', password);
    } else {
      secureLocalStorage.removeItem('email');
      secureLocalStorage.removeItem('password');
    }
  };

  const handleRetrieveStoredCredentials = () => {
    const decryptedEmail = secureLocalStorage.getItem('email') || '';
    const decryptedPassword = secureLocalStorage.getItem('password') || '';
    setEmail(decryptedEmail);
    setPassword(decryptedPassword);
  };

  useEffect(() => {
    handleRetrieveStoredCredentials();
  }, []);

  useEffect(() => {
    handleStoreCredentials();
  }, [checked, email, password]);

  // lembrar-me fim

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => !state.session.server.attributes['ui.disableLoginLanguage']);
  // const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  // const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdEnabled = true;
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const setMapAttribute = (user) => {
    user.attributes = { ...user?.attributes, activeMapStyles: 'locationIqStreets,osm,bingHybrid,bingAerial,bingRoad,googleHybrid,googleSatellite,googleRoad' };
  };

  const generateLoginToken = async () => {
    if (nativeEnvironment) {
      let token = '';
      try {
        const expiration = moment().add(6, 'months').toISOString();
        const response = await fetch('/api/session/token', {
          method: 'POST',
          body: new URLSearchParams(`expiration=${expiration}`),
        });
        if (response.ok) {
          token = await response.text();
        }
      } catch (error) {
        token = '';
      }
      nativePostMessage(`login|${token}`);
    }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),
      });
      if (response.ok) {
        const user = await response.json();
        setMapAttribute(user); // Criado por Guilherme Crocetti para setar os mapas do google e bing no login
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        navigate('/');
      } else {
        throw Error(await response.text());
      }
    } catch (error) {
      setFailed(true);
      setPassword('');
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetch(`/api/session?token=${encodeURIComponent(token)}`);
    if (response.ok) {
      const user = await response.json();
      dispatch(sessionActions.updateUser(user));
      navigate('/');
    } else {
      throw Error(await response.text());
    }
  });

  const handleSpecialKey = (e) => {
    if (e.keyCode === 13 && email && password) {
      handlePasswordLogin(e);
    }
  };

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    console.log(openIdEnabled);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  const redirectToOldWeb = () => {
    window.location.href = 'https://legacy.foxgps.com.br/';
  };

  if (openIdForced) {
    handleOpenIdLogin();
    return (<LinearProgress />);
  }

  return (
    <LoginLayout>
      <div className={classes.container}>
        {useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.primary.main} />}
        <TextField
          required
          error={failed}
          label={t('userEmail')}
          name="email"
          value={email}
          autoComplete="email"
          autoFocus={!email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyUp={handleSpecialKey}
          helperText={failed && 'Invalid username or password'}
        />
        <TextField
          required
          error={failed}
          label={t('userPassword')}
          name="password"
          value={password}
          type="password"
          autoComplete="current-password"
          autoFocus={!!email}
          onChange={(e) => setPassword(e.target.value)}
          onKeyUp={handleSpecialKey}
        />
        <Button
          onClick={handlePasswordLogin}
          onKeyUp={handleSpecialKey}
          variant="contained"
          color="secondary"
          disabled={!email || !password}
        >
          {t('loginLogin')}
        </Button>
        {openIdEnabled && <GoogleLoginButton />}
        <FormGroup>
          <FormControlLabel
            control={(
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            )}
            label="lembrar-me"
          />
        </FormGroup>
        <div className={classes.extraContainer}>
          <Button
            className={classes.registerButton}
            onClick={() => navigate('/register')}
            disabled={!registrationEnabled}
            color="secondary"
          >
            {t('loginRegister')}
          </Button>
          {languageEnabled && (
            <FormControl fullWidth>
              <InputLabel>{t('loginLanguage')}</InputLabel>
              <Select label={t('loginLanguage')} value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}
        </div>
        {emailEnabled && (
          <Link
            onClick={() => navigate('/reset-password')}
            className={classes.resetPassword}
            underline="none"
            variant="caption"
          >
            {t('loginReset')}
          </Link>
        )}

        <Link
          onClick={() => redirectToOldWeb()}
          className={classes.resetPassword}
          underline="none"
          variant="caption"
        >
          Acessar painel antigo
        </Link>

      </div>
      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />
    </LoginLayout>
  );
};

export default LoginPage;
