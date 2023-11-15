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
import MapCamera from './MapCamera';
import { mobileGroupsActions } from '../store/mobile-groups';
import MapMobileGroupPositions from './MapMobileGroupPositions';

const MainMap = ({
  filteredPositions,
  selectedPosition,
  mobileGroupsPositions,
}) => {
  const dispatch = useDispatch();

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(mobileGroupsActions.selectId(null));
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch]
  );

  const onMobileGroupMarkerClick = useCallback(
    (id) => {
      dispatch(devicesActions.selectId(null));
      dispatch(mobileGroupsActions.selectId(id));
    },
    [dispatch]
  );

  return (
    <>
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
        <MapMobileGroupPositions
          positions={mobileGroupsPositions}
          onClick={onMobileGroupMarkerClick}
          selectedPosition={selectedPosition}
          showStatus
        />
        <MapSelectedDevice />
        <PoiMap />
      </MapView>
      {selectedPosition && (
        <MapCamera
          latitude={selectedPosition.latitude}
          longitude={selectedPosition.longitude}
        />
      )}
    </>
  );
};

export default MainMap;
