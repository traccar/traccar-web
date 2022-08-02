import { useId, useEffect } from 'react';
import { map } from './core/MapView';

const MapMarkers = ({ markers }) => {
  const id = useId();

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
        'icon-image': '{category}-{color}',
        'icon-allow-overlap': true,
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
      features: markers.map(({ latitude, longitude, category, color }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          category: category || 'default',
          color,
        },
      })),
    });
  }, [markers]);

  return null;
};

export default MapMarkers;
