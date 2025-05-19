import { useEffect } from 'react';

import { map } from './core/MapView';

const MapPadding = ({ left }) => {
  useEffect(() => {
    const topLeft = document.querySelector('.maplibregl-ctrl-top-left');
    const bottomLeft = document.querySelector('.maplibregl-ctrl-bottom-left');
    topLeft.style.left = `${left}px`;
    bottomLeft.style.left = `${left}px`;
    map.setPadding({ left });
    return () => {
      topLeft.style.left = 0;
      bottomLeft.style.left = 0;
      map.setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
    };
  }, [left]);

  return null;
};

export default MapPadding;
