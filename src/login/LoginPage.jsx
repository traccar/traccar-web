import { useEffect, useState, useRef } from 'react';
import {
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Link,
  Snackbar,
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
  Typography,
} from '@mui/material';
import ReactCountryFlag from 'react-country-flag';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PinOutlinedIcon from '@mui/icons-material/PinOutlined';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import LoginLayout from './LoginLayout';
import usePersistedState from '../common/util/usePersistedState';
import {
  generateLoginToken,
  handleLoginTokenListeners,
  nativeEnvironment,
  nativePostMessage,
} from '../common/components/NativeInterface';
import LogoImage from './LogoImage';
import { useCatch } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  options: {
    position: 'absolute',
    top: theme.spacing(2.5),
    right: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
    zIndex: 10,
    animation: 'fadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both',
    [theme.breakpoints.down('sm')]: {
      top: theme.spacing(1.5),
      right: theme.spacing(1.5),
    },
  },
  toolButton: {
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    borderRadius: 10,
    padding: 7,
    color: theme.palette.text.secondary,
    transition: 'all 240ms ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
      transform: 'translateY(-2px)',
    },
  },
  languageSelect: {
    borderRadius: 10,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#ffffff',
    fontSize: '0.82rem',
    fontWeight: 600,
    border: `1px solid ${theme.palette.divider}`,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiSelect-select': {
      padding: '6px 12px',
      display: 'flex',
      alignItems: 'center',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  mobileLogoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2.5),
    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
  },
  mobileLogoCard: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(225, 29, 72, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
    border: '1px solid #f1f5f9',
    transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
    '&:hover': {
      transform: 'scale(1.06)',
    },
  },
  mobileLogoImg: {
    width: 56,
    height: 56,
    borderRadius: 10,
    objectFit: 'contain',
    display: 'block',
  },
  headerBox: {
    marginBottom: theme.spacing(3),
    textAlign: 'left',
    animation: 'fadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.18s both',
  },
  title: {
    fontSize: '1.65rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    letterSpacing: '-0.025em',
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(0.5),
    lineHeight: 1.4,
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.25),
    animation: 'fadeInUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.28s both',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.25, 1.5),
    borderRadius: 12,
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    animation: 'shakeError 0.5s ease both',
  },
  errorText: {
    fontSize: '0.82rem',
    fontWeight: 500,
  },
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: -theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  },
  forgotLink: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: theme.palette.primary.main,
    cursor: 'pointer',
    transition: 'opacity 200ms ease, transform 200ms ease',
    '&:hover': {
      opacity: 0.8,
      transform: 'translateX(-2px)',
    },
  },
  loginButton: {
    height: 48,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(225, 29, 72, 0.38)',
    transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 260ms ease, background 260ms ease',
    textTransform: 'none',
    marginTop: theme.spacing(1),
    '&:hover': {
      background: 'linear-gradient(135deg, #be123c 0%, #9f1239 100%)',
      boxShadow: '0 8px 24px rgba(225, 29, 72, 0.48)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
    '&.Mui-disabled': {
      background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0',
      color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.3)' : '#94a3b8',
      boxShadow: 'none',
      transform: 'none',
    },
  },
  openIdButton: {
    height: 46,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.9rem',
    border: `1.5px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    textTransform: 'none',
    marginTop: theme.spacing(1.25),
    transition: 'all 240ms ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.text.primary,
      transform: 'translateY(-1px)',
    },
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(3.5),
    paddingTop: theme.spacing(2.5),
    borderTop: `1px solid ${theme.palette.divider}`,
    animation: 'fadeInUp 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
  },
  registerText: {
    fontSize: '0.85rem',
    color: theme.palette.text.secondary,
  },
  registerLink: {
    fontWeight: 600,
    color: theme.palette.primary.main,
    cursor: 'pointer',
    marginLeft: theme.spacing(0.5),
    transition: 'opacity 200ms ease',
    '&:hover': {
      textDecoration: 'underline',
      opacity: 0.85,
    },
  },
  transitionOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 40%, #ffffff 100%)',
    animation: 'slideInRight 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
    padding: theme.spacing(3),
  },
  transitionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
    padding: theme.spacing(4.5, 3.5),
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 25px 50px -12px rgba(225, 29, 72, 0.12), 0 0 1px 1px rgba(15, 23, 42, 0.04)',
    animation: 'cardScaleUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both',
  },
  transitionLogoBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    border: '1px solid #f1f5f9',
    boxShadow: '0 8px 24px rgba(225, 29, 72, 0.12)',
    marginBottom: theme.spacing(2.5),
    animation: 'breatheGlow 4s ease-in-out infinite alternate',
  },
  transitionLogoImg: {
    width: 68,
    height: 68,
    borderRadius: 12,
    objectFit: 'contain',
    display: 'block',
  },
  transitionTitle: {
    fontSize: '1.45rem',
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    marginBottom: theme.spacing(0.75),
  },
  transitionSubtitle: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: theme.spacing(3),
    lineHeight: 1.4,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 999,
    backgroundColor: '#ffe4e6',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: 999,
    background: 'linear-gradient(90deg, #e11d48 0%, #fb7185 50%, #e11d48 100%)',
    animation: 'progressFill 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
}));

const LoginPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { languages, language, setLocalLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({
    code: values[0],
    country: values[1].country,
    name: values[1].name,
  }));

  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimerRef = useRef();

  useEffect(() => () => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
  }, []);

  const [email, setEmail] = usePersistedState('loginEmail', '');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showServerTooltip, setShowServerTooltip] = useState(false);

  const registrationEnabled = useSelector((state) => state.session.server.registration);
  const languageEnabled = useSelector((state) => {
    const attributes = state.session.server.attributes;
    return !attributes.language && !attributes['ui.disableLoginLanguage'];
  });
  const changeEnabled = useSelector((state) => !state.session.server.attributes.disableChange);
  const emailEnabled = useSelector((state) => state.session.server.emailEnabled);
  const openIdEnabled = useSelector((state) => state.session.server.openIdEnabled);
  const openIdForced = useSelector((state) => state.session.server.openIdEnabled && state.session.server.openIdForce);
  const [codeEnabled, setCodeEnabled] = useState(false);

  const [announcementShown, setAnnouncementShown] = useState(false);
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);
    setLoading(true);
    try {
      const query = `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams(code.length ? `${query}&code=${code}` : query),
      });
      if (response.ok) {
        const user = await response.json();
        generateLoginToken();
        dispatch(sessionActions.updateUser(user));
        const target = window.sessionStorage.getItem('postLogin') || '/';
        window.sessionStorage.removeItem('postLogin');
        setTransitioning(true);
        transitionTimerRef.current = setTimeout(() => {
          navigate(target, { replace: true });
        }, 1750);
      } else if (response.status === 401 && response.headers.get('WWW-Authenticate') === 'TOTP') {
        setCodeEnabled(true);
      } else {
        throw Error(await response.text());
      }
    } catch {
      setFailed(true);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleTokenLogin = useCatch(async (token) => {
    const response = await fetchOrThrow(`/api/session?token=${encodeURIComponent(token)}`);
    const user = await response.json();
    dispatch(sessionActions.updateUser(user));
    setTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      navigate('/');
    }, 1750);
  });

  const handleOpenIdLogin = () => {
    document.location = '/api/session/openid/auth';
  };

  useEffect(() => nativePostMessage('authentication'), []);

  useEffect(() => {
    const listener = (token) => handleTokenLogin(token);
    handleLoginTokenListeners.add(listener);
    return () => handleLoginTokenListeners.delete(listener);
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem('hostname') !== window.location.hostname) {
      window.localStorage.setItem('hostname', window.location.hostname);
      setShowServerTooltip(true);
    }
  }, []);

  return (
    <LoginLayout>
      <div className={classes.options}>
        {nativeEnvironment && changeEnabled && (
          <Tooltip title={`${t('settingsServer')}: ${window.location.hostname}`} open={showServerTooltip} arrow>
            <IconButton className={classes.toolButton} onClick={() => navigate('/change-server')}>
              <VpnLockIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {languageEnabled && (
          <FormControl size="small">
            <Select
              value={language}
              onChange={(e) => setLocalLanguage(e.target.value)}
              className={classes.languageSelect}
              variant="outlined"
            >
              {languageList.map((it) => (
                <MenuItem key={it.code} value={it.code}>
                  <Box component="span" sx={{ mr: 1, display: 'inline-flex' }}>
                    <ReactCountryFlag countryCode={it.country} svg />
                  </Box>
                  {it.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <form className={classes.form} onSubmit={handlePasswordLogin}>
        {isMobile && (
          <div className={classes.mobileLogoWrapper}>
            <div className={classes.mobileLogoCard}>
              <LogoImage className={classes.mobileLogoImg} />
            </div>
          </div>
        )}

        <div className={classes.headerBox}>
          <Typography variant="h5" className={classes.title}>
            {t('loginTitle') || 'Sign In'}
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            Enter your credentials to access your tracking dashboard
          </Typography>
        </div>

        <div className={classes.fieldsContainer}>
          {failed && (
            <div className={classes.errorBanner}>
              <ErrorOutlineIcon fontSize="small" />
              <Typography className={classes.errorText}>
                {t('loginFailed') || 'Incorrect email address or password'}
              </Typography>
            </div>
          )}

          {!openIdForced && (
            <>
              <TextField
                required
                error={failed}
                label={t('userEmail')}
                name="email"
                value={email}
                autoComplete="email"
                autoFocus={!email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                required
                error={failed}
                label={t('userPassword')}
                name="password"
                value={password}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoFocus={!!email}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: theme.palette.text.secondary }}
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {emailEnabled && (
                <div className={classes.forgotRow}>
                  <Link
                    onClick={() => navigate('/reset-password')}
                    className={classes.forgotLink}
                    underline="none"
                  >
                    {t('loginReset')}
                  </Link>
                </div>
              )}

              {codeEnabled && (
                <TextField
                  required
                  error={failed}
                  label={t('loginTotpCode')}
                  name="code"
                  value={code}
                  type="number"
                  onChange={(e) => setCode(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className={classes.loginButton}
                disabled={!email || !password || (codeEnabled && !code) || loading}
              >
                {t('loginLogin')}
              </Button>
            </>
          )}

          {openIdEnabled && (
            <Button
              onClick={() => handleOpenIdLogin()}
              variant="outlined"
              fullWidth
              className={classes.openIdButton}
            >
              {t('loginOpenId')}
            </Button>
          )}
        </div>

        {registrationEnabled && !openIdForced && (
          <div className={classes.footer}>
            <Typography variant="body2" className={classes.registerText}>
              {t('loginRegisterQuestion') || "Don't have an account?"}
              <Link
                onClick={() => navigate('/register')}
                className={classes.registerLink}
                underline="none"
              >
                {t('loginRegister')}
              </Link>
            </Typography>
          </div>
        )}
      </form>

      <Snackbar
        open={!!announcement && !announcementShown}
        message={announcement}
        action={(
          <IconButton size="small" color="inherit" onClick={() => setAnnouncementShown(true)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      />

      {transitioning && (
        <div className={classes.transitionOverlay}>
          <div className={classes.transitionCard}>
            <div className={classes.transitionLogoBadge}>
              <LogoImage className={classes.transitionLogoImg} />
            </div>
            <Typography className={classes.transitionTitle}>
              Welcome to AmsonTracker
            </Typography>
            <Typography className={classes.transitionSubtitle}>
              Launching your fleet dashboard & live telemetry...
            </Typography>
            <div className={classes.progressTrack}>
              <div className={classes.progressBar} />
            </div>
          </div>
        </div>
      )}
    </LoginLayout>
  );
};

export default LoginPage;
