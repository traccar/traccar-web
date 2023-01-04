import React from 'react';
import { useMediaQuery, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/material/styles';
import LogoImage from './LogoImage';
import Image from '../resources/images/cover-1920.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',

  },
  paper: {
    backgroundImage: `url(${Image})`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    boxShadow: '-2px 0px 16px rgba(0, 0, 0, 0.25)',
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(0, 0, 0, 0),
    },
  },
  form: {
    border: '1px solid rgba(0,0,0,.125)',
    borderRadius: '0.25rem',
    boxShadow: '0 3px 15px 1px rgb(0 0 0 / 15%)',
    backgroundColor: 'rgba(255,255,255,0.75)',
    maxWidth: theme.spacing(52),
    padding: theme.spacing(5),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
}));

const LoginLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <main className={classes.root}>
      <Paper className={classes.paper}>
        <form className={classes.form}>
          {!useMediaQuery(theme.breakpoints.down('lg')) && <LogoImage color={theme.palette.secondary.contrastText} />}
          {children}
        </form>
      </Paper>
    </main>
  );
};

export default LoginLayout;
