import React, { useState } from 'react';
import {
  Grid, Button, TextField, Typography, Link, makeStyles, Snackbar,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StartPage from '../../StartPage';
import { useTranslation } from '../../LocalizationProvider';
import useQuery from '../../common/useQuery';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginLeft: theme.spacing(2),
    textTransform: 'uppercase',
  },
  link: {
    fontSize: theme.spacing(3),
    fontWeight: 500,
    marginTop: theme.spacing(0.5),
    cursor: 'pointer',
  },
}));

const ResetPasswordForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();
  const query = useQuery();

  const token = query.get('passwordReset');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let response;
    if (!token) {
      response = await fetch('/api/password/reset', {
        method: 'POST',
        body: new URLSearchParams(`email=${encodeURIComponent(email)}`),
      });
    } else {
      response = await fetch('/api/password/update', {
        method: 'POST',
        body: new URLSearchParams(`token=${encodeURIComponent(token)}&password=${encodeURIComponent(password)}`),
      });
    }
    if (response.ok) {
      setSnackbarOpen(true);
    }
  };

  return (
    <StartPage>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        onClose={() => history.push('/login')}
        autoHideDuration={6000}
        message={!token ? t('loginResetSuccess') : t('loginUpdateSuccess')}
      />
      <Grid container direction="column" spacing={2}>
        <Grid container item>
          <Grid item>
            <Typography className={classes.link} color="primary">
              <Link onClick={() => history.push('/login')}>
                <ArrowBackIcon />
              </Link>
            </Typography>
          </Grid>
          <Grid item xs>
            <Typography className={classes.title} color="primary">
              {t('loginReset')}
            </Typography>
          </Grid>
        </Grid>
        {!token
          ? (
            <Grid item>
              <TextField
                required
                fullWidth
                type="email"
                label={t('userEmail')}
                name="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                variant="filled"
              />
            </Grid>
          )
          : (
            <Grid item>
              <TextField
                required
                fullWidth
                label={t('userPassword')}
                name="password"
                value={password}
                type="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                variant="filled"
              />
            </Grid>
          )}
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={!/(.+)@(.+)\.(.{2,})/.test(email) && !password}
            fullWidth
          >
            {t('loginReset')}
          </Button>
        </Grid>
      </Grid>
    </StartPage>
  );
};

export default ResetPasswordForm;
