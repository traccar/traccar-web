import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { map } from './core/MapView';
import useMapLayer from './core/useMapLayer';
import { formatTime, getStatusColor } from '../common/util/formatter';
import { mapIconKey } from './core/preloadImages';
import { useAttributePreference } from '../common/util/preferences';
import { useCatchCallback } from '../reactHelper';
import { findFonts, fromMapCoordinates, toMapCoordinates } from './core/mapUtil';

const onMouseEnter = () => (map.getCanvas().style.cursor = 'pointer');
const onMouseLeave = () => (map.getCanvas().style.cursor = '');

const MapPositions = ({
  positions,
  onMapClick,
  onMarkerClick,
  showStatus,
  selectedPosition,
  titleField,
  disabled,
}) => {
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const iconScale = useAttributePreference('iconScale', desktop ? 0.75 : 1);

  const devices = useSelector((state) => state.devices.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const mapCluster = useAttributePreference('mapCluster', true);
  const directionType = useAttributePreference('mapDirection', 'selected');

  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const createFeature = useCallback(
    (devices, position, selectedPositionId) => {
      const device = devices[position.deviceId];
      let showDirection;
      switch (directionType) {
        case 'none':
          showDirection = false;
          break;
        case 'all':
          showDirection = position.course > 0;
          break;
        default:
          showDirection = selectedPositionId === position.id && position.course > 0;
          break;
      }
      return {
        id: position.id,
        deviceId: position.deviceId,
        name: device.name,
        fixTime: formatTime(position.fixTime, 'seconds'),
        category: mapIconKey(device.category),
        color: showStatus ? position.attributes.color || getStatusColor(device.status) : 'neutral',
        rotation: position.course,
        direction: showDirection,
      };
    },
    [directionType, showStatus],
  );

  const onMapClickCallback = useCallback(
    (event) => {
      if (!event.defaultPrevented && onMapClick) {
        const [longitude, latitude] = fromMapCoordinates(event.lngLat.lng, event.lngLat.lat);
        onMapClick(latitude, longitude);
      }
    },
    [onMapClick],
  );

  useEffect(() => {
    map.on('click', onMapClickCallback);
    return () => map.off('click', onMapClickCallback);
  }, [onMapClickCallback]);

  const onMarkerClickCallback = useCallback(
    (event) => {
      if (disabledRef.current) return;
      event.preventDefault();
      const feature = event.features[0];
      if (onMarkerClick) {
        onMarkerClick(feature.properties.id, feature.properties.deviceId);
      }
    },
    [onMarkerClick],
  );

  const symbolLayer = {
    type: 'symbol',
    filter: ['!has', 'point_count'],
    layout: {
      'icon-image': '{category}-{color}',
      'icon-size': iconScale,
      'icon-allow-overlap': true,
      'text-field': `{${titleField || 'name'}}`,
      'text-allow-overlap': true,
      'text-anchor': 'bottom',
      'text-offset': [0, -2 * iconScale],
      'text-font': findFonts(map),
      'text-size': 12,
      'symbol-sort-key': ['get', 'id'],
    },
    paint: {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    },
    on: {
      mouseenter: onMouseEnter,
      mouseleave: onMouseLeave,
      click: onMarkerClickCallback,
    },
  };

  const directionLayer = {
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
  };

  const buildData = (source) => ({
    type: 'FeatureCollection',
    features: positions
      .filter((it) => devices.hasOwnProperty(it.deviceId))
      .filter((it) =>
        source === 'main' ? it.deviceId !== selectedDeviceId : it.deviceId === selectedDeviceId,
      )
      .map((position) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: toMapCoordinates(position.longitude, position.latitude),
        },
        properties: createFeature(devices, position, selectedPosition && selectedPosition.id),
      })),
  });

  const onClusterClick = useCatchCallback(async (event) => {
    if (disabledRef.current) return;
    event.preventDefault();
    const feature = event.features[0];
    const zoom = await map
      .getSource(feature.source)
      .getClusterExpansionZoom(feature.properties.cluster_id);
    map.easeTo({
      center: feature.geometry.coordinates,
      zoom,
    });
  }, []);

  useMapLayer({
    source: {
      cluster: mapCluster,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    },
    layers: [
      symbolLayer,
      directionLayer,
      {
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
        on: {
          mouseenter: onMouseEnter,
          mouseleave: onMouseLeave,
          click: onClusterClick,
        },
      },
    ],
    layersDeps: [mapCluster, onMarkerClickCallback, onClusterClick, iconScale, titleField],
    data: buildData('main'),
    dataDeps: [devices, positions, selectedPosition, selectedDeviceId, createFeature],
  });

  useMapLayer({
    layers: [symbolLayer, directionLayer],
    layersDeps: [onMarkerClickCallback, iconScale, titleField],
    data: buildData('selected'),
    dataDeps: [devices, positions, selectedPosition, selectedDeviceId, createFeature],
  });

  return null;
};

export default MapPositions;
