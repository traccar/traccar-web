import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';

import t from './common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(3)}px`,
  },
  logo: {
    margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px`
  },
  buttons: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    flex: '1 1 0',
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px 0`
  },
}));

const LoginPage = () => {
  const [filled, setFilled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const classes = useStyles();
  const history = useHistory();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleRegister = () => {
    // TODO: Implement registration
  }

  const handleLogin = (event) => {
    event.preventDefault();
    fetch('/api/session', { method: 'POST', body: new URLSearchParams(`email=${email}&password=${password}`) }).then(response => {
      if (response.ok) {
        history.push('/'); // TODO: Avoid calling sessions twice
      } else {
        setFailed(true);
        setPassword('');
      }
    });
  }

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <img className={classes.logo} src="/logo.svg" alt="Traccar" />
        <form onSubmit={handleLogin}>
          <FormControl margin="normal" required fullWidth error={failed}>
            <InputLabel htmlFor="email">{t('userEmail')}</InputLabel>
            <Input
              id="email"
              name="email"
              value={email}
              autoComplete="email"
              autoFocus
              onChange={handleEmailChange} />
            {failed && <FormHelperText>Invalid username or password</FormHelperText>}
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">{t('userPassword')}</InputLabel>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={handlePasswordChange} />
          </FormControl>

          <div className={classes.buttons}>
            <Button
              type="button"
              variant="contained"
              disabled
              className={classes.button}
              onClick={handleRegister}>
              {t('loginRegister')}
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!email || !password}
              className={classes.button}>
              {t('loginLogin')}
            </Button>

          </div>
        </form>
      </Paper>
    </main>
  );
}

export default LoginPage;
