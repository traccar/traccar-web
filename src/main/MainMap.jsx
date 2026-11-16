import { useCallback, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch } from 'react-redux';
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
import MapPositionMarkers from '../map/MapPositionMarkers';
import MapOverlay from '../map/overlay/MapOverlay';
import MapGeocoder from '../map/control/MapGeocoder';
import MapScale from '../map/MapScale';
import MapRuler from '../map/control/MapRuler';
import useFeatures from '../common/util/useFeatures';
import { useTranslation } from '../common/components/LocalizationProvider';

const MainMap = ({ filteredPositions, selectedPosition }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const features = useFeatures();

  const [rulerActive, setRulerActive] = useState(false);

  const onMarkerClick = useCallback(
    (_, deviceId) => {
      dispatch(devicesActions.selectId(deviceId));
    },
    [dispatch],
  );

  // Main map: Google only, as three map types; tools sit with the zoom buttons
  const mapTypes = [
    { id: 'googleRoad', label: t('mapTypeMap') },
    { id: 'googleHybrid', label: t('mapTypeSatellite') },
    { id: 'googleRoadTraffic', label: t('mapTypeTraffic') },
  ];
  const toolsPosition = theme.direction === 'rtl' ? 'bottom-right' : 'bottom-left';

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
          disabled={rulerActive}
        />
        <MapDefaultCamera filteredPositions={filteredPositions} />
        <MapSelectedDevice />
        <MapRuler
          positions={filteredPositions}
          onActiveChange={setRulerActive}
          position={toolsPosition}
        />
      </MapView>
      <MapScale />
      <MapCurrentLocation position={toolsPosition} />
      <MapGeocoder position={toolsPosition} />
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
