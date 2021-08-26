import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';
import { useLocalization } from '../common/localization';
import { map } from './Map';

const CurrentLocationMap = () => {
  const {direction} = useLocalization();

  useEffect(() => {
    const controlsPosition = direction ==='rtl' ? 'top-left' : 'top-right';

    const control = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      trackUserLocation: true,
    });
    map.addControl(control,controlsPosition);
    return () => map.removeControl(control);
  }, [direction]);

  return null;
};

export default CurrentLocationMap;
