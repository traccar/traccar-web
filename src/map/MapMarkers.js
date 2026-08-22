import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { map } from './core/MapView';
import useMapLayer from './core/useMapLayer';
import { useAttributePreference } from '../common/util/preferences';
import { findFonts, toMapCoordinates } from './core/mapUtil';

const MapMarkers = ({ markers, showTitles }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  useMapLayer({
    layers: [
      {
        type: 'symbol',
        filter: showTitles ? ['!has', 'point_count'] : undefined,
        layout: showTitles
          ? {
              'icon-image': '{image}',
              'icon-size': iconScale,
              'icon-allow-overlap': true,
              'text-field': '{title}',
              'text-allow-overlap': true,
              'text-anchor': 'bottom',
              'text-offset': [0, -2 * iconScale],
              'text-font': findFonts(map),
              'text-size': 12,
            }
          : {
              'icon-image': '{image}',
              'icon-size': iconScale,
              'icon-allow-overlap': true,
            },
        paint: showTitles
          ? {
              'text-halo-color': 'white',
              'text-halo-width': 1,
            }
          : undefined,
      },
    ],
    layersDeps: [showTitles, iconScale],
    data: {
      type: 'FeatureCollection',
      features: markers.map(({ latitude, longitude, image, title }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: toMapCoordinates(longitude, latitude),
        },
        properties: {
          image: image || 'default-neutral',
          title: title || '',
        },
      })),
    },
    dataDeps: [showTitles, markers],
  });

  return null;
};

export default MapMarkers;
