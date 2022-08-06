import React, { useRef } from 'react';
import { makeStyles } from '@mui/styles';
import image from '../resources/images/logo.svg';

const useStyles = makeStyles(() => ({
  image: {
    alignSelf: 'center',
    maxWidth: '240px',
    maxHeight: '120px',
    width: 'auto',
    height: 'auto',
    visibility: 'hidden',
  },
}));

const LogoImage = ({ color }) => {
  const classes = useStyles();

  const element = useRef(null);

  return (
    <object
      type="image/svg+xml"
      data={image}
      aria-label="logo"
      className={classes.image}
      ref={element}
      onLoad={() => {
        const imageDocument = element.current.contentDocument;
        imageDocument.querySelectorAll('svg').forEach((element) => {
          const style = imageDocument.createElement('style');
          style.appendChild(imageDocument.createTextNode(`g { color: ${color}; }`));
          element.insertAdjacentElement('afterbegin', style);
          element.innerHTML += '';
        });
        element.current.style.visibility = 'visible';
      }}
    />
  );
};

export default LogoImage;
