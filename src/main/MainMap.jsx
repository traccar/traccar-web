import React, { useCallback, memo } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import MapView from '../map/core/MapView';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/MapGeofence';
import MapCurrentLocation from '../map/MapCurrentLocation';
import PoiMap from '../map/main/PoiMap';
import MapPadding from '../map/MapPadding';
import { devicesActions } from '../store';
import MapDefaultCamera from '../map/main/MapDefaultCamera';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapPositions from '../map/MapPositions';
import MapOverlay from '../map/overlay/MapOverlay';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import MapScale from '../map/MapScale';
import useFeatures from '../common/util/useFeatures';
import usePersistedState from '../common/util/usePersistedState';
import useMapOverlays from '../map/overlay/useMapOverlays';
import { useAttributePreference } from '../common/util/preferences';
import MapPanelButton from '../map/components/MapPannelButton';

import '../map/notification/notification.css';
import '../map/overlay/overlay.css';

// Memoize MapOverlay to avoid unnecessary re-renders
const MemoizedMapOverlay = memo(MapOverlay);

const MainMap = ({ filteredPositions, selectedPosition, onEventsClick }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const eventsAvailable = useSelector((state) => !!state.events.items.length);

  const [overlayEnabled, setOverlayEnabled] = usePersistedState('mapOverlayEnabled', true);

  const features = useFeatures();
  const mapOverlays = useMapOverlays();

  const selectedMapOverlay = useAttributePreference('selectedMapOverlay');

  const activeOverlay = mapOverlays
    .filter((overlay) => overlay.available)
    .find((overlay) => overlay.id === selectedMapOverlay);

  const onMarkerClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.selectId(deviceId));
  }, [dispatch]);

  const onOverlayButtonClick = useCallback(() => {
    setOverlayEnabled((enabled) => !enabled);
  }, [setOverlayEnabled]);

  return (
    <>
      <MapView>
        {overlayEnabled && <MemoizedMapOverlay activeOverlay={activeOverlay} />}
        <MapGeofence />
        <MapAccuracy positions={filteredPositions} />
        <MapLiveRoutes />
        <MapPositions
          positions={filteredPositions}
          onClick={onMarkerClick}
          selectedPosition={selectedPosition}
          showStatus
        />
        <MapDefaultCamera />
        <MapSelectedDevice />
        <PoiMap />
      </MapView>

      <MapScale />
      {/* Overlay Switcher */}
      {activeOverlay && (
        <MapPanelButton
          enabled={overlayEnabled}
          onClick={onOverlayButtonClick}
          iconClass={(status) => `maplibre-ctrl-background-icon maplibre-ctrl-overlay maplibre-ctrl-overlay-${status}`}
        />
      )}
      <MapCurrentLocation />
      <MapGeocoder />
      {/* Notifications */}
      {!features.disableEvents && (
        <MapPanelButton
          enabled={eventsAvailable}
          onClick={onEventsClick}
          iconClass={(status) => `maplibre-ctrl-background-icon maplibre-ctrl-notification maplibre-ctrl-notification-${status}`}
        />
      )}
      {desktop && (
        <MapPadding left={parseInt(theme.dimensions.drawerWidthDesktop, 10) + parseInt(theme.spacing(1.5), 10)} />
      )}
    </>
  );
};

export default MainMap;
