import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField, Typography, IconButton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { messagesActions } from '../store';
import { useCatch } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import PasswordField from '../common/components/PasswordField';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
}));

const ResetPasswordPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('passwordReset');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = useCatch(async (event) => {
    event.preventDefault();
    if (!token) {
      await fetchOrThrow('/api/password/reset', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      });
    } else {
      await fetchOrThrow('/api/password/update', {
        method: 'POST',
        body: new URLSearchParams(
          `token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`,
        ),
      });
    }
    dispatch(
      messagesActions.push({
        message: t(!token ? 'loginResetSuccess' : 'loginUpdateSuccess'),
        severity: 'success',
      }),
    );
    navigate('/login');
  });

  return (
    <LoginLayout>
      <div className={classes.container}>
        <div className={classes.header}>
          <IconButton color="primary" onClick={() => navigate('/login')}>
            <BackIcon />
          </IconButton>
          <Typography className={classes.title} color="primary">
            {t('loginReset')}
          </Typography>
        </div>
        {!token ? (
          <TextField
            required
            type="email"
            label={t('userEmail')}
            name="email"
            value={email}
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        ) : (
          <PasswordField
            required
            label={t('userPassword')}
            name="password"
            value={password}
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        )}
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          onClick={handleSubmit}
          disabled={!/(.+)@(.+)\.(.{2,})/.test(email) && !password}
          fullWidth
        >
          {t('loginReset')}
        </Button>
      </div>
    </LoginLayout>
  );
};

export default ResetPasswordPage;
