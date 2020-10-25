import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect } from 'react';

import { map } from './Map';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
});

const GeofenceMap = () => {
  useEffect(() => {
    const mm = map;
    map.addControl(draw, 'top-left');
    return () => map.removeControl(draw);
  }, []);

  return null;
}

export default GeofenceMap;
