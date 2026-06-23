import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { map } from '../core/MapView';
import { useAttributePreference } from '../../common/util/preferences';
import { toMapCoordinates } from '../core/mapUtil';
import { useTranslation } from '../../common/components/LocalizationProvider';

const MapLiveRoutes = ({ deviceIds }) => {
  const id = useId();

  const theme = useTheme();
  const t = useTranslation();

  const type = useAttributePreference('mapLiveRoutes', 'none');

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const history = useSelector((state) => state.session.history);

  const mapLineWidth = useAttributePreference('mapLineWidth', 2);
  const mapLineOpacity = useAttributePreference('mapLineOpacity', 1);

  useEffect(() => {
    if (type !== 'none') {
      map.addSource(id, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [],
          },
        },
      });
      map.addLayer({
        source: id,
        id,
        type: 'line',
        metadata: { 'traccar:title': t('mapLiveRoutes') },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': ['get', 'width'],
          'line-opacity': ['get', 'opacity'],
        },
      });

      return () => {
        if (map.getLayer(id)) {
          map.removeLayer(id);
        }
        if (map.getSource(id)) {
          map.removeSource(id);
        }
      };
    }
    return () => {};
  }, [type, id, t]);

  useEffect(() => {
    if (type !== 'none') {
      const visibleIds = deviceIds
        .filter((id) => (type === 'selected' ? id === selectedDeviceId : true))
        .filter((id) => history.hasOwnProperty(id))
        .filter((id) => devices[id]);

      map.getSource(id)?.setData({
        type: 'FeatureCollection',
        features: visibleIds.map((deviceId) => ({
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: history[deviceId].map(([longitude, latitude]) =>
              toMapCoordinates(longitude, latitude),
            ),
          },
          properties: {
            color:
              devices[deviceId]?.attributes?.['web.reportColor'] || theme.palette.geometry.main,
            width: mapLineWidth,
            opacity: mapLineOpacity,
          },
        })),
      });
    }
  }, [
    theme,
    type,
    devices,
    selectedDeviceId,
    history,
    deviceIds,
    id,
    mapLineOpacity,
    mapLineWidth,
  ]);

  return null;
};

export default MapLiveRoutes;
