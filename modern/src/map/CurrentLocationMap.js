import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';
import { map } from './Map';

const CurrentLocationMap = () => {
  useEffect(() => {
    const control = new mapboxgl.GeolocateControl({
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
}

export default CurrentLocationMap;
