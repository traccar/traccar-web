import { useTheme } from '@mui/styles';
import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import { findFonts } from './core/mapUtil';

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
        'line-width': 3,
        'line-color': theme.palette.primary.main,
        // 'line-color': [
        //   'interpolate',
        //   ['linear'],
        //   ['get', 'speed'],
        //   0, theme.palette.error.main,
        //   30, theme.palette.warning.main,
        //   60, theme.palette.primary.main,
        // ],
      },
    });
    if (name) {
      map.addLayer({
        source: id,
        id: `${id}-title`,
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-font': findFonts(map),
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
      coordinates = positions.map((item) => [item.longitude, item.latitude, item.speed]);
    }

    map.getSource(id)?.setData({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      features: positions.map((position, index) => ({
        properties: {
          name,
          speed: position.speed,
        },
      })),
    });
  }, [theme, positions, coordinates, reportColor]);

  return null;
};

export default MapRoutePath;
