import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sessionActions } from './store';
import { Grid, useMediaQuery, makeStyles, InputLabel, Select, MenuItem, FormControl, Button, TextField, Paper, Link } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import RegisterDialog from './RegisterDialog';
import { useSelector } from 'react-redux';

import t from './common/localization';
import Logo from './Logo';

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
    paddingBottom: theme.spacing(5),
    width: theme.dimensions.sidebarWidth,
    [theme.breakpoints.down('md')]: {
      width: theme.dimensions.tabletSidebarWidth,
    },
    [theme.breakpoints.down('xs')]: {
      width: '0px',
    },
  },
  paper: {
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 25, 0, 0)
    },
  },
  form: {
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: "100%",
  },
  logo: {
    textAlign: 'center',
  },
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
        {!matches && <Logo fill='#fff'/> }
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form} onSubmit={handleLogin}>
          <Grid container direction='column' spacing={3}>
            <Grid item className={classes.logo}>
              {matches && <Logo fill='#333366'/>}
            </Grid>
            <Grid item>
              <TextField
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
            </Grid>
            <Grid item>
              <TextField
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
            </Grid>
            <Grid item>
              <Button 
                type='submit'
                variant='contained' 
                color='secondary'
                disabled={!email || !password}
                fullWidth>
                {t('loginLogin')}
              </Button>
            </Grid>
            <Grid item container>
              <Grid item>
                <Button onClick={handleRegister} disabled={!registrationEnabled} color="secondary">
                  {t('loginRegister')}
                </Button>
              </Grid>
              <Grid item xs>
                <FormControl variant="filled" fullWidth>
                  <InputLabel>{t('loginLanguage')}</InputLabel>
                  <Select>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid item container justify="flex-end">
              <Grid item>
                <Link underline="none">{t('loginReset')}</Link>              
              </Grid>
            </Grid>            
          </Grid>
        </form>
      </Paper>
    </main>
  )
}
export default LoginPage;
