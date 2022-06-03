import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { geofenceToFeature } from '../core/mapUtil';

const MapGeofence = () => {
  const id = 'geofences';

  const theme = useTheme();

  const geofences = useSelector((state) => state.geofences.items);

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer({
      source: id,
      id: 'geofences-fill',
      type: 'fill',
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
      ],
      paint: {
        'fill-color': theme.palette.colors.geometry,
        'fill-outline-color': theme.palette.colors.geometry,
        'fill-opacity': 0.1,
      },
    });
    map.addLayer({
      source: id,
      id: 'geofences-line',
      type: 'line',
      paint: {
        'line-color': theme.palette.colors.geometry,
        'line-width': 2,
      },
    });
    map.addLayer({
      source: id,
      id: 'geofences-title',
      type: 'symbol',
      layout: {
        'text-field': '{name}',
        'text-font': ['Roboto Regular'],
        'text-size': 12,
      },
      paint: {
        'text-halo-color': 'white',
        'text-halo-width': 1,
      },
    });

    return () => {
      if (map.getLayer('geofences-fill')) {
        map.removeLayer('geofences-fill');
      }
      if (map.getLayer('geofences-line')) {
        map.removeLayer('geofences-line');
      }
      if (map.getLayer('geofences-title')) {
        map.removeLayer('geofences-title');
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData({
      type: 'FeatureCollection',
      features: Object.values(geofences).map(geofenceToFeature),
    });
  }, [geofences]);

  return null;
};

export default MapGeofence;
