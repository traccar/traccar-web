import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';
import { map } from './core/MapView';
import { useTheme } from '@mui/material';

const MapCurrentLocation = () => {
  const theme = useTheme();

  useEffect(() => {
    const control = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      trackUserLocation: true,
    });
    map.addControl(control, theme.direction === 'rtl' ? 'top-left' : 'top-right');
    return () => map.removeControl(control);
  }, []);

  return null;
};

export default MapCurrentLocation;
