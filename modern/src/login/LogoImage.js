import React from 'react';
import { makeStyles } from '@mui/styles';
import { ReactComponent as Logo } from '../resources/images/logo.svg';

const useStyles = makeStyles(() => ({
  image: {
    alignSelf: 'center',
    maxWidth: '240px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
  },
}));

const LogoImage = ({ color }) => {
  const classes = useStyles();

  return (<Logo className={classes.image} style={{ color }} />);
};

export default LogoImage;
