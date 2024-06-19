import { useId, useCallback, useEffect } from 'react';
import { useTheme } from '@mui/styles';
import { map } from './core/MapView';
import { getSpeedColor } from '../common/util/colors';

const MapRoutePoints = ({ positions, onClick }) => {
  const id = useId();
  const theme = useTheme();

  const onMouseEnter = () => map.getCanvas().style.cursor = 'pointer';
  const onMouseLeave = () => map.getCanvas().style.cursor = '';

  const onMarkerClick = useCallback((event) => {
    event.preventDefault();
    const feature = event.features[0];
    if (onClick) {
      onClick(feature.properties.id, feature.properties.index);
    }
  }, [onClick]);

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
      paint: {
        'text-color': ['get', 'color'],
      },
      layout: {
        'text-field': '▲',
        'text-allow-overlap': true,
        'text-rotate': ['get', 'rotation'],
      },
    });

    map.on('mouseenter', id, onMouseEnter);
    map.on('mouseleave', id, onMouseLeave);
    map.on('click', id, onMarkerClick);

    return () => {
      map.off('mouseenter', id, onMouseEnter);
      map.off('mouseleave', id, onMouseLeave);
      map.off('click', id, onMarkerClick);

      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, [onMarkerClick]);

  useEffect(() => {
    const maxSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.max(a, b), -Infinity);
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: positions.map((position, index) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [position.longitude, position.latitude],
        },
        properties: {
          index,
          id: position.id,
          rotation: position.course,
          color: getSpeedColor(theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, position.speed, maxSpeed),
        },
      })),
    });
  }, [onMarkerClick, positions]);

  return null;
};

export default MapRoutePoints;
