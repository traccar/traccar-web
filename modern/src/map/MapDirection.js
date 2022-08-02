import { useId, useEffect } from 'react';
import { useAttributePreference } from '../common/util/preferences';
import { map } from './core/MapView';

const MapDirection = ({ position }) => {
  const id = useId();

  const iconScale = useAttributePreference('iconScale', 1);

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer({
      id,
      type: 'symbol',
      source: id,
      layout: {
        'icon-image': 'direction',
        'icon-size': iconScale,
        'icon-rotate': ['get', 'rotation'],
        'icon-rotation-alignment': 'map',
      },
    });

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [position.longitude, position.latitude],
          },
          properties: {
            rotation: position.course,
          },
        },
      ],
    });
  }, [position]);

  return null;
};

export default MapDirection;
