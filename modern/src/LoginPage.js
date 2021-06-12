import React, { useState } from 'react';
import { useMediaQuery, makeStyles, Paper } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import LoginForm from './components/registration/LoginForm';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.secondary.contrastText,
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
}));

const LoginPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [CurrentForm, setCurrentForm] = useState(() => LoginForm);

  return (
    <main className={classes.root}>
      <div className={classes.sidebar}>
        {!useMediaQuery(theme.breakpoints.down('md')) &&
          <svg height="64" width="240">
            <use xlinkHref="/logo.svg#img"></use>
          </svg>
        }
      </div>
      <Paper className={classes.paper}>
        <form className={classes.form}>
          <CurrentForm setCurrentForm={setCurrentForm} />
        </form>
      </Paper>
    </main>
  )
}
export default LoginPage;
