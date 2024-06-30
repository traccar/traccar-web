import { useTheme } from '@mui/styles';
import { useId, useEffect } from 'react';
import { map } from './core/MapView';
import { getSpeedColor } from '../common/util/colors';

const MapRoutePath = ({ name, positions }) => {
  const id = useId();

  const theme = useTheme();

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    });
    map.addLayer({
      source: id,
      id: `${id}-line`,
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 2,
      },
    });
    if (name) {
      map.addLayer({
        source: id,
        id: `${id}-title`,
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-size': 12,
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 1,
        },
      });
    }

    return () => {
      if (map.getLayer(`${id}-title`)) {
        map.removeLayer(`${id}-title`);
      }
      if (map.getLayer(`${id}-line`)) {
        map.removeLayer(`${id}-line`);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    const maxSpeed = positions.map((item) => item.speed).reduce((a, b) => Math.max(a, b), -Infinity);
    const features = [];
    for (let i = 0; i < positions.length - 1; i += 1) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[positions[i].longitude, positions[i].latitude], [positions[i + 1].longitude, positions[i + 1].latitude]],
        },
        properties: {
          color: getSpeedColor(
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main,
            positions[i + 1].speed,
            maxSpeed,
          ),
        },
      });
    }
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features,
      properties: {
        name,
      },
    });
  }, [theme, positions]);

  return null;
};

export default MapRoutePath;
