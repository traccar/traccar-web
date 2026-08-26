import * as maplibregl from 'maplibre-gl';
import { useEffect, useMemo } from 'react';
import { useTheme } from '@mui/material';
import { useAttributePreference } from '../common/util/preferences';
import { map, useMapReady } from './core/MapView';

const MapScale = () => {
  const theme = useTheme();
  const mapReady = useMapReady();

  const distanceUnit = useAttributePreference('distanceUnit');

  const control = useMemo(() => new maplibregl.ScaleControl(), []);

  useEffect(() => {
    if (!mapReady) return;
    map.addControl(control, theme.direction === 'rtl' ? 'bottom-right' : 'bottom-left');
    return () => map.removeControl(control);
  }, [mapReady, control, theme.direction]);

  useEffect(() => {
    if (!mapReady) return;
    switch (distanceUnit) {
      case 'mi':
        control.setUnit('imperial');
        break;
      case 'nmi':
        control.setUnit('nautical');
        break;
      case 'km':
      default:
        control.setUnit('metric');
        break;
    }
  }, [mapReady, control, distanceUnit]);

  return null;
};

export default MapScale;
