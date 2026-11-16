import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
import MapView from '../map/core/MapView';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/MapGeofence';
import PoiMap from '../map/main/PoiMap';
import MapPadding from '../map/MapPadding';
import { devicesActions } from '../store';
import MapDefaultCamera from '../map/main/MapDefaultCamera';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapPositionMarkers from '../map/MapPositionMarkers';
import MapOverlay from '../map/overlay/MapOverlay';
import useFeatures from '../common/util/useFeatures';
import { useTranslation } from '../common/components/LocalizationProvider';

const MainMap = ({ filteredPositions, selectedPosition }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const features = useFeatures();

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch],
  );

  // Main map: Google only, as three map types, plus zoom buttons
  const mapTypes = [
    { id: 'googleRoad', label: t('mapTypeMap') },
    { id: 'googleHybrid', label: t('mapTypeSatellite') },
    { id: 'googleRoadTraffic', label: t('mapTypeTraffic') },
  ];

  return (
    <>
      <MapView mapTypes={mapTypes}>
        <MapOverlay />
        <MapGeofence />
        <MapAccuracy positions={filteredPositions} />
        <MapLiveRoutes deviceIds={filteredPositions.map((p) => p.deviceId)} />
        <PoiMap />
        <MapPositionMarkers
          positions={filteredPositions}
          onMarkerClick={onMarkerClick}
          selectedPosition={selectedPosition}
          showStatus
        />
        <MapDefaultCamera filteredPositions={filteredPositions} />
        <MapSelectedDevice />
      </MapView>
      {desktop && (
        <MapPadding
          start={
            (features.disableDeviceList
              ? 0
              : parseInt(theme.dimensions.drawerWidthDesktop, 10) +
                parseInt(theme.spacing(1.5), 10)) +
            (features.disableTabs ? 0 : parseInt(theme.dimensions.railWidth, 10))
          }
        />
      )}
    </>
  );
};

export default MainMap;
