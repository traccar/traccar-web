import { useEffect } from 'react';

import { map } from './core/MapView';
import { useTheme } from '@mui/material';

const MapPadding = ({ start }) => {
  const theme = useTheme();

  useEffect(() => {
    const startKey = theme.direction === 'rtl' ? 'right' : 'left';
    const topStart = document.querySelector(`.maplibregl-ctrl-top-${startKey}`);
    const bottomStart = document.querySelector(`.maplibregl-ctrl-bottom-${startKey}`);
    topStart.style.insetInlineStart = `${start}px`;
    bottomStart.style.insetInlineStart = `${start}px`;
    map.setPadding({ [theme.direction === 'rtl' ? 'right' : 'left']: start });
    return () => {
      topStart.style.insetInlineStart = 0;
      bottomStart.style.insetInlineStart = 0;
      map.setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
    };
  }, [start]);

  return null;
};

export default MapPadding;
