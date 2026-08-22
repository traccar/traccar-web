import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import useMapLayer from '../core/useMapLayer';
import { useAttributePreference } from '../../common/util/preferences';
import { toMapCoordinates } from '../core/mapUtil';
import { useTranslation } from '../../common/components/LocalizationProvider';

const MapLiveRoutes = ({ deviceIds }) => {
  const theme = useTheme();
  const t = useTranslation();

  const type = useAttributePreference('mapLiveRoutes', 'none');

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const history = useSelector((state) => state.session.history);

  const mapLineWidth = useAttributePreference('mapLineWidth', 2);
  const mapLineOpacity = useAttributePreference('mapLineOpacity', 1);

  const visibleIds = deviceIds
    .filter((id) => (type === 'selected' ? id === selectedDeviceId : true))
    .filter((id) => history.hasOwnProperty(id))
    .filter((id) => devices[id]);

  useMapLayer({
    enabled: type !== 'none',
    layers: [
      {
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
      },
    ],
    layersDeps: [t],
    data: {
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
          color: devices[deviceId]?.attributes?.['web.reportColor'] || theme.palette.geometry.main,
          width: mapLineWidth,
          opacity: mapLineOpacity,
        },
      })),
    },
    dataDeps: [
      theme,
      type,
      devices,
      selectedDeviceId,
      history,
      deviceIds,
      mapLineWidth,
      mapLineOpacity,
    ],
  });

  return null;
};

export default MapLiveRoutes;
