import { useCallback, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { map } from './core/MapView';
import useMapLayer from './core/useMapLayer';
import { useAttributePreference } from '../common/util/preferences';
import { useCatchCallback } from '../reactHelper';
import { findFonts, toMapCoordinates } from './core/mapUtil';

const onMouseEnter = () => (map.getCanvas().style.cursor = 'pointer');
const onMouseLeave = () => (map.getCanvas().style.cursor = '');

const MapMarkers = ({ markers, showTitles, cluster, direction, onClick, disabled }) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const onMarkerClick = useCallback(
    (event) => {
      if (disabledRef.current) return;
      event.preventDefault();
      onClick?.(event.features[0].properties);
    },
    [onClick],
  );

  const onClusterClick = useCatchCallback(async (event) => {
    if (disabledRef.current) return;
    event.preventDefault();
    const feature = event.features[0];
    const zoom = await map
      .getSource(feature.source)
      .getClusterExpansionZoom(feature.properties.cluster_id);
    map.easeTo({ center: feature.geometry.coordinates, zoom });
  }, []);

  const layers = [
    {
      type: 'symbol',
      filter: ['!has', 'point_count'],
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
            'symbol-sort-key': ['get', 'id'],
          }
        : {
            'icon-image': '{image}',
            'icon-size': iconScale,
            'icon-allow-overlap': true,
            'symbol-sort-key': ['get', 'id'],
          },
      ...(showTitles ? { paint: { 'text-halo-color': 'white', 'text-halo-width': 1 } } : {}),
      ...(onClick
        ? { on: { mouseenter: onMouseEnter, mouseleave: onMouseLeave, click: onMarkerClick } }
        : {}),
    },
  ];

  if (direction) {
    layers.push({
      key: 'direction',
      type: 'symbol',
      filter: ['all', ['!has', 'point_count'], ['==', 'direction', true]],
      layout: {
        'icon-image': 'direction',
        'icon-size': iconScale,
        'icon-allow-overlap': true,
        'icon-rotate': ['get', 'rotation'],
        'icon-rotation-alignment': 'map',
      },
    });
  }

  if (cluster) {
    layers.push({
      key: 'clusters',
      type: 'symbol',
      filter: ['has', 'point_count'],
      layout: {
        'icon-image': 'background',
        'icon-size': iconScale,
        'text-field': '{point_count_abbreviated}',
        'text-font': findFonts(map),
        'text-size': 14,
      },
      on: { mouseenter: onMouseEnter, mouseleave: onMouseLeave, click: onClusterClick },
    });
  }

  useMapLayer({
    source: cluster ? { cluster: true, clusterMaxZoom: 14, clusterRadius: 50 } : undefined,
    layers,
    layersDeps: [showTitles, cluster, direction, iconScale, onMarkerClick, onClusterClick],
    data: {
      type: 'FeatureCollection',
      features: markers.map(
        ({ latitude, longitude, image, title, rotation, direction: showDirection, ...rest }) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: toMapCoordinates(longitude, latitude),
          },
          properties: {
            ...rest,
            image: image || 'default-neutral',
            title: title || '',
            rotation: rotation || 0,
            direction: showDirection || false,
          },
        }),
      ),
    },
    dataDeps: [markers, showTitles],
  });

  return null;
};

export default MapMarkers;
