import { useEffect } from 'react';

import { map } from './core/MapView';

const MapCamera = ({
  latitude, longitude,
}) => {
  useEffect(() => {
    map.jumpTo({
      center: [longitude, latitude],
      zoom: Math.max(map.getZoom(), 10),
    });
  }, [latitude, longitude]);

  return null;
};

export default MapCamera;
