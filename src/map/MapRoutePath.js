import { useTheme } from '@mui/styles';
import { useId, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import getSpeedColor from '../common/util/colors';
import { useAttributePreference } from '../common/util/preferences';

const MapRoutePath = ({ positions }) => {
  const id = useId();
  const theme = useTheme();

  const MaxExpectedDeviceSpeed = useAttributePreference('ui.MaxExpectedDeviceSpeed');

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
    return null;
  });

  const maxSpeed = useMemo(() => {
    if (MaxExpectedDeviceSpeed > 0) {
      return MaxExpectedDeviceSpeed;
    }
    return positions.map((item) => item.speed).reduce((a, b) => Math.max(a, b), -Infinity);
  }, [MaxExpectedDeviceSpeed, positions]);

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
    const features = [];
    for (let i = 0; i < positions.length - 1; i += 1) {
      features.push({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[positions[i].longitude, positions[i].latitude], [positions[i + 1].longitude, positions[i + 1].latitude]],
        },
        properties: {
          color: reportColor || getSpeedColor(
            positions[i + 1].speed,
            maxSpeed,
          ),
        },
      });
    }
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features,
    });
  }, [theme, positions, reportColor, maxSpeed, id]);

  return null;
};

export default MapRoutePath;
