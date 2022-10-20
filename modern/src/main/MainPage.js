import React, {
  useState, useEffect, useCallback,
} from 'react';
import {
  Paper, Button,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListIcon from '@mui/icons-material/ViewList';
import { useDispatch, useSelector } from 'react-redux';
import DevicesList from './DevicesList';
import MapView from '../map/core/MapView';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/MapGeofence';
import MapCurrentLocation from '../map/MapCurrentLocation';
import BottomMenu from '../common/components/BottomMenu';
import { useTranslation } from '../common/components/LocalizationProvider';
import PoiMap from '../map/main/PoiMap';
import MapPadding from '../map/MapPadding';
import StatusCard from '../common/components/StatusCard';
import { devicesActions } from '../store';
import MapDefaultCamera from '../map/main/MapDefaultCamera';
import usePersistedState from '../common/util/usePersistedState';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import MapPositions from '../map/MapPositions';
import MapOverlay from '../map/overlay/MapOverlay';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import MapScale from '../map/MapScale';
import MapNotification from '../map/notification/MapNotification';
import EventsDrawer from './EventsDrawer';
import useFeatures from '../common/util/useFeatures';
import useFilter from './useFilter';
import MainToolbar from './MainToolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 3,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    bottom: theme.dimensions.bottomBarHeight,
    transition: 'transform .5s ease',
    backgroundColor: 'white',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 0,
    },
  },
  sidebarCollapsed: {
    transform: `translateX(-${theme.dimensions.drawerWidthDesktop})`,
    marginLeft: 0,
    [theme.breakpoints.down('md')]: {
      transform: 'translateX(-100vw)',
    },
  },
  toolbarContainer: {
    zIndex: 4,
  },
  deviceList: {
    flex: 1,
  },
  sidebarToggle: {
    position: 'fixed',
    left: theme.spacing(1.5),
    top: theme.spacing(3),
    borderRadius: '0px',
    minWidth: 0,
    [theme.breakpoints.down('md')]: {
      left: 0,
    },
  },
  sidebarToggleText: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.only('xs')]: {
      display: 'none',
    },
  },
  sidebarToggleBg: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.6)',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  bottomMenu: {
    position: 'fixed',
    left: theme.spacing(1.5),
    bottom: theme.spacing(1.5),
    zIndex: 4,
    width: theme.dimensions.drawerWidthDesktop,
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const phone = useMediaQuery(theme.breakpoints.down('sm'));

  const features = useFeatures();

  const [mapOnSelect] = usePersistedState('mapOnSelect', false);

  const [mapLiveRoutes] = usePersistedState('mapLiveRoutes', false);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.positions.items);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [filter, setFilter] = useState({
    keyword: '',
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);

  const [devicesOpen, setDevicesOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const eventHandler = useCallback(() => setEventsOpen(true), [setEventsOpen]);
  const eventsAvailable = useSelector((state) => !!state.events.items.length);

  useEffect(() => setDevicesOpen(desktop), [desktop]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);

  useFilter(filter, filterSort, filterMap, positions, setFilteredDevices, setFilteredPositions);

  return (
    <div className={classes.root}>
      <MapView>
        <MapOverlay />
        <MapGeofence />
        <MapAccuracy positions={filteredPositions} />
        {mapLiveRoutes && <MapLiveRoutes />}
        <MapPositions positions={filteredPositions} onClick={onClick} selectedPosition={selectedPosition} showStatus />
        <MapDefaultCamera />
        <MapSelectedDevice />
        <PoiMap />
      </MapView>
      <MapScale />
      <MapCurrentLocation />
      <MapGeocoder />
      {!features.disableEvents && <MapNotification enabled={eventsAvailable} onClick={eventHandler} />}
      {desktop && <MapPadding left={parseInt(theme.dimensions.drawerWidthDesktop, 10)} />}
      <Button
        variant="contained"
        color={phone ? 'secondary' : 'primary'}
        classes={{ containedPrimary: classes.sidebarToggleBg }}
        className={classes.sidebarToggle}
        onClick={() => setDevicesOpen(!devicesOpen)}
        disableElevation
      >
        <ListIcon />
        <div className={classes.sidebarToggleText}>{t('deviceTitle')}</div>
      </Button>
      <Paper square elevation={3} className={`${classes.sidebar} ${!devicesOpen && classes.sidebarCollapsed}`}>
        <Paper square elevation={3} className={classes.toolbarContainer}>
          <MainToolbar
            filter={filter}
            setFilter={setFilter}
            filterSort={filterSort}
            setFilterSort={setFilterSort}
            filterMap={filterMap}
            setFilterMap={setFilterMap}
          />
        </Paper>
        <div className={classes.deviceList}>
          <DevicesList devices={filteredDevices} />
        </div>
      </Paper>
      {desktop && (
        <div className={classes.bottomMenu}>
          <BottomMenu />
        </div>
      )}
      {!features.disableEvents && <EventsDrawer open={eventsOpen} onClose={() => setEventsOpen(false)} />}
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={positions[selectedDeviceId]}
          onClose={() => dispatch(devicesActions.select(null))}
          desktopPadding={theme.dimensions.drawerWidthDesktop}
        />
      )}
    </div>
  );
};

export default MainPage;
