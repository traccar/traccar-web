import './geocoder.css';
import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { map } from '../core/MapView';
import { errorsActions } from '../../store';

const MapGeocoder = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const geocoder = {
      forwardGeocode: async (config) => {
        const features = [];
        try {
          const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
          const response = await fetch(request);
          const geojson = await response.json();
          geojson.features.forEach((feature) => {
            const center = [
              feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
              feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
            ];
            features.push({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center,
              },
              place_name: feature.properties.display_name,
              properties: feature.properties,
              text: feature.properties.display_name,
              place_type: ['place'],
              center,
            });
          });
        } catch (e) {
          dispatch(errorsActions.push(e.message));
        }
        return { features };
      },
    };

    const control = new MaplibreGeocoder(geocoder, {
      maplibregl,
      collapsed: true,
    });
    map.addControl(control);
    return () => map.removeControl(control);
  }, [dispatch]);

  return null;
};

export default MapGeocoder;
