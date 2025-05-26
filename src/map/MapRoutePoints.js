import { useId, useCallback, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { map } from './core/MapView';
import getSpeedColor from '../common/util/colors';
import { findFonts } from './core/mapUtil';
import { SpeedLegendControl } from './legend/MapSpeedLegend';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAttributePreference } from '../common/util/preferences';

const MapRoutePoints = ({ positions, onClick }) => {
  const id = useId();
  const theme = useTheme();
  const t = useTranslation();
  const speedUnit = useAttributePreference('speedUnit');

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
        'text-font': findFonts(map),
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
    const minSpeed = positions.map((p) => p.speed).reduce((a, b) => Math.min(a, b), Infinity);

    const control = new SpeedLegendControl(positions, speedUnit, t, maxSpeed, minSpeed);
    map.addControl(control, theme.direction === 'rtl' ? 'bottom-right' : 'bottom-left');

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
          color: getSpeedColor(position.speed, minSpeed, maxSpeed),
        },
      })),
    });
    return () => map.removeControl(control);
  }, [onMarkerClick, positions]);

  return null;
};

export default MapRoutePoints;
