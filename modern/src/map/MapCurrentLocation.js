import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';
import { map } from './core/MapView';

const MapCurrentLocation = () => {
  useEffect(() => {
    const control = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      trackUserLocation: true,
    });
    map.addControl(control);
    return () => map.removeControl(control);
  }, []);

  return null;
};

export default MapCurrentLocation;
