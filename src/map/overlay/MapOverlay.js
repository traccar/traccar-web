import { useId, useEffect } from 'react';
import { map } from '../core/MapView';

const MapOverlay = ({ activeOverlay }) => {
  const id = useId();

  useEffect(() => {
    if (activeOverlay) {
      map.addSource(id, activeOverlay.source);
      map.addLayer({
        id,
        type: 'raster',
        source: id,
        layout: {
          visibility: 'visible',
        },
      });
    }
    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [id, activeOverlay]);

  return null;
};

export default MapOverlay;
