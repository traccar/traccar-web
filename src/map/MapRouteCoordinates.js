import { useTheme } from '@mui/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';

const MapRouteCoordinates = ({ name, coordinates, deviceId }) => {
  const id = useId();

  const theme = useTheme();

  const reportColor = useSelector((state) => {
    const attributes = state.devices.items[deviceId]?.attributes;
    if (attributes) {
      const color = attributes['web.reportColor'];
      if (color) {
        return color;
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
    map.getSource(id)?.setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      properties: {
        name,
        color: reportColor,
      },
    });
  }, [theme, coordinates, reportColor]);

  return null;
};

export default MapRouteCoordinates;
