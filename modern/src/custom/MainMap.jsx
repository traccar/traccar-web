import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import MapView from './MapView';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from './MapGeofence';
import PoiMap from '../map/main/PoiMap';
import { devicesActions } from '../store';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapPositions from './MapPositions';
import MapOverlay from '../map/overlay/MapOverlay';

const MainMap = ({ filteredPositions, selectedPosition }) => {
  const dispatch = useDispatch();

  const onMarkerClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.selectId(deviceId));
  }, [dispatch]);

  return (
    <MapView>
      <MapOverlay />
      <MapGeofence />
      <MapAccuracy positions={filteredPositions} />
      <MapLiveRoutes />
      <MapPositions
        positions={filteredPositions}
        onClick={onMarkerClick}
        selectedPosition={selectedPosition}
        showStatus
      />
      <MapSelectedDevice />
      <PoiMap />
    </MapView>
  );
};

export default MainMap;
