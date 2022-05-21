import React, { useState } from 'react';
import {
  Grid, Button, TextField, Typography, Link, makeStyles, Snackbar,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LoginLayout from './LoginLayout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { snackBarDurationShortMs } from '../common/util/duration';
import { useCatch } from '../reactHelper';

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

const RegisterPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = useCatch(async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (response.ok) {
      setSnackbarOpen(true);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <LoginLayout>
      <Snackbar
        open={snackbarOpen}
        onClose={() => history.push('/login')}
        autoHideDuration={snackBarDurationShortMs}
        message={t('loginCreated')}
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
              {t('loginRegister')}
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <TextField
            required
            fullWidth
            label={t('sharedName')}
            name="name"
            value={name}
            autoComplete="name"
            autoFocus
            onChange={(event) => setName(event.target.value)}
            variant="filled"
          />
        </Grid>
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
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            disabled={!name || !/(.+)@(.+)\.(.{2,})/.test(email) || !password}
            fullWidth
          >
            {t('loginRegister')}
          </Button>
        </Grid>
      </Grid>
    </LoginLayout>
  );
};

export default RegisterPage;
