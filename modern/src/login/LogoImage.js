import React from 'react';
import { useSelector } from 'react-redux';
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

  const imageFile = useSelector((state) => state.session.server.attributes?.logo);

  if (imageFile) {
    return (
      <img className={classes.image} src={imageFile} alt="" />
    );
  }
  return (
    <Logo className={classes.image} style={{ color }} />
  );
};

export default LogoImage;
