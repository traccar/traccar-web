import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate } from 'react-router-dom';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import { useTheme } from '@mui/material/styles';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { snackBarDurationShortMs } from '../common/util/duration';
import { useCatch, useEffectAsync } from '../reactHelper';
import { sessionActions } from '../store';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2.25),
    width: '100%',
    animation: 'fadeInUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) both',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  backButton: {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 10,
    padding: 6,
    color: theme.palette.text.secondary,
    transition: 'all 160ms ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.primary,
      transform: 'translateX(-2px)',
    },
  },
  title: {
    fontSize: '1.45rem',
    fontWeight: 700,
    color: theme.palette.text.primary,
    letterSpacing: '-0.02em',
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 16px rgba(225, 29, 72, 0.38)',
    transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 180ms ease, background 180ms ease',
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
}));

const RegisterPage = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const t = useTranslation();

  const server = useSelector((state) => state.session.server);
  const totpForce = useSelector((state) => state.session.server.attributes.totpForce);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpKey, setTotpKey] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffectAsync(async () => {
    if (totpForce) {
      const response = await fetchOrThrow('/api/users/totp', { method: 'POST' });
      setTotpKey(await response.text());
    }
  }, [totpForce, setTotpKey]);

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    await fetchOrThrow('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, totpKey }),
    });
    setSnackbarOpen(true);
  });

  return (
    <LoginLayout>
      <form onSubmit={handleSubmit} className={classes.container}>
        <div className={classes.header}>
          {!server.newServer && (
            <IconButton className={classes.backButton} onClick={() => navigate('/login')}>
              <BackIcon />
            </IconButton>
          )}
          <Typography className={classes.title}>
            {t('loginRegister')}
          </Typography>
        </div>

        <TextField
          required
          label={t('sharedName')}
          name="name"
          value={name}
          autoComplete="name"
          autoFocus
          onChange={(event) => setName(event.target.value)}
          placeholder="John Doe"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          required
          type="email"
          label={t('userEmail')}
          name="email"
          value={email}
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
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
          label={t('userPassword')}
          name="password"
          value={password}
          type="password"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {totpForce && (
          <TextField
            required
            label={t('loginTotpKey')}
            name="totpKey"
            value={totpKey || ''}
            slotProps={{
              input: {
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyOutlinedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={!name || !password || !(server.newServer || /(.+)@(.+)\.(.{2,})/.test(email))}
          fullWidth
          className={classes.submitButton}
        >
          {t('loginRegister')}
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        onClose={() => {
          dispatch(sessionActions.updateServer({ ...server, newServer: false }));
          navigate('/login');
        }}
        autoHideDuration={snackBarDurationShortMs}
        message={t('loginCreated')}
      />
    </LoginLayout>
  );
};

export default RegisterPage;
