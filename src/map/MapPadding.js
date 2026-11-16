import { useEffect } from 'react';

import { map, useMapReady } from './core/MapView';
import { useTheme } from '@mui/material';

// Keeps the map clear of a side panel of width `start`. With `controlsAtStart`, the top
// control column (normally at the end edge) is moved next to the panel instead.
const MapPadding = ({ start, controlsAtStart = false }) => {
  const theme = useTheme();
  const mapReady = useMapReady();

  useEffect(() => {
    if (!mapReady) return;
    const startKey = theme.direction === 'rtl' ? 'right' : 'left';
    const endKey = theme.direction === 'rtl' ? 'left' : 'right';
    const topStart = document.querySelector(`.maplibregl-ctrl-top-${startKey}`);
    const bottomStart = document.querySelector(`.maplibregl-ctrl-bottom-${startKey}`);
    const topEnd = document.querySelector(`.maplibregl-ctrl-top-${endKey}`);
    topStart.style.insetInlineStart = `${start}px`;
    bottomStart.style.insetInlineStart = `${start}px`;
    if (controlsAtStart) {
      topEnd.style[endKey] = 'auto';
      topEnd.style.insetInlineStart = `${start}px`;
    }
    map.setPadding({ [startKey]: start });
    return () => {
      topStart.style.insetInlineStart = 0;
      bottomStart.style.insetInlineStart = 0;
      topEnd.style[endKey] = '';
      topEnd.style.insetInlineStart = '';
      map.setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
    };
  }, [mapReady, start, controlsAtStart, theme.direction]);

  return null;
};

export default MapPadding;
