import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { map } from './core/MapView';
import { findFonts, geofenceToFeature } from './core/mapUtil';
import { useTranslation } from '../common/components/LocalizationProvider';

const MapGeofence = () => {
  const id = useId();

  const theme = useTheme();
  const t = useTranslation();

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
      filter: ['all', ['==', '$type', 'Polygon']],
      metadata: { 'traccar:title': t('sharedGeofences') },
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
      metadata: { 'traccar:title': t('sharedGeofences') },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': ['get', 'width'],
        'line-opacity': ['get', 'opacity'],
      },
    });
    map.addLayer({
      source: id,
      id: 'geofences-title',
      type: 'symbol',
      metadata: { 'traccar:title': t('sharedGeofences') },
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
  }, [id, t]);

  useEffect(() => {
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: Object.values(geofences)
        .filter((geofence) => !geofence.attributes.hide)
        .map((geofence) => geofenceToFeature(theme, geofence)),
    });
  }, [geofences, id, theme]);

  return null;
};

export default MapGeofence;
