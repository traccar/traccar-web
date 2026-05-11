import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { map } from '../core/MapView';
import notificationIcon from '../../resources/images/map/notification.svg?url';

const useStyles = makeStyles()((theme) => ({
  button: {
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: '#333',
      maskImage: `url("${notificationIcon}")`,
      maskPosition: 'center',
      maskRepeat: 'no-repeat',
    },
    '&.active::before': {
      backgroundColor: theme.palette.error.main,
    },
  },
}));

const MapNotification = ({ enabled, onClick }) => {
  const theme = useTheme();
  const { classes } = useStyles();

  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  const buttonRef = useRef(null);

  useEffect(() => {
    const control = {
      onAdd: () => {
        const container = document.createElement('div');
        container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `maplibregl-ctrl-icon ${classes.button}`;
        button.onclick = () => onClickRef.current?.();
        container.appendChild(button);
        buttonRef.current = button;
        return container;
      },
      onRemove: () => {},
    };
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, [theme.direction, classes.button]);

  useEffect(() => {
    buttonRef.current?.classList.toggle('active', enabled);
  }, [enabled]);

  return null;
};

export default MapNotification;
