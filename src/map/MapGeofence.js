import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/styles';
import { map } from './core/MapView';
import { findFonts, geofenceToFeature } from './core/mapUtil';
import { useAttributePreference } from '../common/util/preferences';

const MapGeofence = () => {
  const id = useId();

  const theme = useTheme();

  const mapGeofences = useAttributePreference('mapGeofences', true);

  const geofences = useSelector((state) => state.geofences.items);

  useEffect(() => {
    if (mapGeofences) {
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
          'fill-color': ['get', 'color'],
          'fill-outline-color': ['get', 'color'],
          'fill-opacity': 0.1,
        },
      });
      map.addLayer({
        source: id,
        id: 'geofences-line',
        type: 'line',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
        },
      });
      map.addLayer({
        source: id,
        id: 'geofences-title',
        type: 'symbol',
        layout: {
          'text-field': '{name}',
          'text-font': findFonts(map),
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
    }
    return () => {};
  }, [mapGeofences]);

  useEffect(() => {
    if (mapGeofences) {
      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: Object.values(geofences).map((geofence) => geofenceToFeature(theme, geofence)),
      });
    }
  }, [mapGeofences, geofences]);

  return null;
};

export default MapGeofence;
