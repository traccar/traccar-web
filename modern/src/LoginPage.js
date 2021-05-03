import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from './store';
import { Grid, 
         useMediaQuery, 
         makeStyles, 
         InputLabel, 
         Select, 
         MenuItem, 
         FormControl, 
         Button, 
         TextField, 
         Paper } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import RegisterDialog from './RegisterDialog';
import { useSelector } from 'react-redux';

import t from './common/localization';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.common.purple,
    width: '28%',
    [theme.breakpoints.down('xs')]: {
      width: '0px',
    },
  },
  paper: {
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(8, 4),
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)'
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  register: {
    marginTop: theme.spacing(2),
  }
}));

const LoginPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  const dispatch = useDispatch();
  const history = useHistory();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registerDialogShown, setRegisterDialogShown] = useState(false);
  const registrationEnabled =  useSelector(state => state.session.server ? state.session.server['registration'] : false);
  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  }

  const handleRegister = () => {
    setRegisterDialogShown(true);
  }

  const handleRegisterResult = () => {
    setRegisterDialogShown(false);
  }

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
  }

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        {!matches && <img src='/logo.svg' alt='Traccar' />}
      </div>
      <Paper className={classes.paper}>
        {matches && <img src='/logo_main.svg' alt='Traccar' />}
        <form className={classes.form} onSubmit={handleLogin}>
          <TextField
            margin='normal'
            required
            fullWidth
            error={failed}
            label={t('userEmail')}
            name='email'
            value={email}
            autoComplete='email'
            autoFocus
            onChange={handleEmailChange}
            helperText={failed && 'Invalid username or password'}
            variant='filled' />
          <TextField
            margin='normal'
            required
            fullWidth
            error={failed}
            label={t('userPassword')}
            name='password'
            value={password}
            type='password'
            autoComplete='current-password'
            onChange={handlePasswordChange}
            variant='filled' />
          <Button 
            type='submit'
            variant='contained' 
            color='secondary'
            className={classes.submit}
            disabled={!email || !password}
            fullWidth>
            {t('loginLogin')}
          </Button>
          <Grid container>
            <Grid item xs={3}>
              <Button className={classes.register} onClick={handleRegister} disabled={!registrationEnabled} color="secondary">
                {t('loginRegister')}
              </Button>
            </Grid>
            <Grid item xs={9}>
              <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel>{t('loginLanguage')}</InputLabel>
                <Select>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container justify="flex-end">
            <Grid item>
              <Button color="primary">
                {t('loginReset')}
              </Button>              
            </Grid>
          </Grid>
        </form>
      </Paper>
    </main>
  )
}
export default LoginPage;
