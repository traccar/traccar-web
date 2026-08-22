import turfCircle from '@turf/circle';
import { useTheme } from '@mui/material/styles';
import useMapLayer from '../core/useMapLayer';
import { toMapCoordinates } from '../core/mapUtil';
import { useTranslation } from '../../common/components/LocalizationProvider';

const MapAccuracy = ({ positions }) => {
  const theme = useTheme();
  const t = useTranslation();

  useMapLayer({
    layers: [
      {
        type: 'fill',
        filter: ['all', ['==', '$type', 'Polygon']],
        metadata: { 'traccar:title': t('positionAccuracy') },
        paint: {
          'fill-color': theme.palette.geometry.main,
          'fill-outline-color': theme.palette.geometry.main,
          'fill-opacity': 0.25,
        },
      },
    ],
    layersDeps: [t, theme.palette.geometry.main],
    data: {
      type: 'FeatureCollection',
      features: positions
        .filter((position) => position.accuracy > 0)
        .map((position) =>
          turfCircle(
            toMapCoordinates(position.longitude, position.latitude),
            position.accuracy * 0.001,
          ),
        ),
    },
    dataDeps: [positions],
  });

  return null;
};

export default MapAccuracy;
