import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { map } from './core/MapView';
import useMapLayer from './core/useMapLayer';
import { findFonts, toMapCoordinates } from './core/mapUtil';
import { useAttributePreference } from '../common/util/preferences';

const MapRouteCoordinates = ({ name, coordinates, deviceId }) => {
  const theme = useTheme();

  const reportColor = useSelector((state) => {
    const attributes = state.devices.items[deviceId]?.attributes;
    if (attributes) {
      const color = attributes['web.reportColor'];
      if (color) {
        return color;
      }
    }
    return theme.palette.geometry.main;
  });

  const mapLineWidth = useAttributePreference('mapLineWidth', 2);
  const mapLineOpacity = useAttributePreference('mapLineOpacity', 1);

  useMapLayer({
    layers: [
      {
        key: 'line',
        type: 'line',
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
      {
        key: 'title',
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
      },
    ],
    layersDeps: [],
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates.map(([longitude, latitude]) =>
          toMapCoordinates(longitude, latitude),
        ),
      },
      properties: {
        name,
        color: reportColor,
        width: mapLineWidth,
        opacity: mapLineOpacity,
      },
    },
    dataDeps: [coordinates, reportColor, mapLineWidth, mapLineOpacity, name],
  });

  return null;
};

export default MapRouteCoordinates;
