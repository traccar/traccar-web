import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from './store';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    width: 'auto',
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
    padding: theme.spacing(3),
  },
  logo: {
    marginTop: theme.spacing(2)
  },
  buttons: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '40%',
    },
  },
}));

const LoginPage = () => {
  const dispatch = useDispatch();

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
        dispatch(sessionActions.authenticated(true));
        history.push('/');
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

          <TextField
            margin="normal"
            required
            fullWidth
            error={failed}
            label={t('userEmail')}
            name="email"
            value={email}
            autoComplete="email"
            autoFocus
            onChange={handleEmailChange}
            helperText={failed && 'Invalid username or password'} />

          <TextField
            margin="normal"
            required
            fullWidth
            error={failed}
            label={t('userPassword')}
            name="password"
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={handlePasswordChange} />

          <FormControl fullWidth margin="normal">
            <div className={classes.buttons}>
              <Button type="button" variant="contained" disabled onClick={handleRegister}>
                {t('loginRegister')}
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={!email || !password}>
                {t('loginLogin')}
              </Button>
            </div>
          </FormControl>
        </form>
      </Paper>
    </main>
  );
}

export default LoginPage;
