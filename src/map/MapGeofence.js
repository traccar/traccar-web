import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { map } from './core/MapView';
import useMapLayer from './core/useMapLayer';
import { findFonts, geofenceToFeature } from './core/mapUtil';
import { useTranslation } from '../common/components/LocalizationProvider';

const MapGeofence = () => {
  const theme = useTheme();
  const t = useTranslation();

  const geofences = useSelector((state) => state.geofences.items);

  useMapLayer({
    layers: [
      {
        key: 'fill',
        type: 'fill',
        filter: ['all', ['==', '$type', 'Polygon']],
        metadata: { 'traccar:title': t('sharedGeofences') },
        paint: {
          'fill-color': ['get', 'color'],
          'fill-outline-color': ['get', 'color'],
          'fill-opacity': 0.1,
        },
      },
      {
        key: 'line',
        type: 'line',
        metadata: { 'traccar:title': t('sharedGeofences') },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': ['get', 'opacity'],
        },
      },
      {
        key: 'title',
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
      },
    ],
    layersDeps: [t],
    data: {
      type: 'FeatureCollection',
      features: Object.values(geofences)
        .filter((geofence) => !geofence.attributes.hide)
        .map((geofence) => geofenceToFeature(theme, geofence)),
    },
    dataDeps: [geofences, theme],
  });

  return null;
};

export default MapGeofence;
