import { useTheme } from '@mui/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import { getSpeedColor } from '../common/util/colors';

const MapRoutePath = ({ name, positions, coordinates }) => {
  const id = useId();

  const theme = useTheme();

  const reportColor = useSelector((state) => {
    const position = positions?.find(() => true);
    if (position) {
      const attributes = state.devices.items[position.deviceId]?.attributes;
      if (attributes) {
        const color = attributes['web.reportColor'];
        if (color) {
          return color;
        }
      }
    }
    return theme.palette.geometry.main;
  });

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
    if (!coordinates) {
      coordinates = positions.map((item) => [item.longitude, item.latitude]);
    }
    const maxSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.max(a, b), -Infinity);
    const features = [];
    for (let i = 0; i < positions.length - 1; i += 1) {
      const p1 = positions[i];
      const p2 = positions[i + 1];
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[p1.longitude, p1.latitude], [p2.longitude, p2.latitude]],
        },
        properties: {
          color: getSpeedColor(theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, p1.speed, maxSpeed),
        },
      });
    }

    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [theme, positions, coordinates, reportColor]);

  return null;
};

export default MapRoutePath;
