import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Toolbar, IconButton, Button, OutlinedInput, InputAdornment, Popover, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Checkbox, Badge,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListIcon from '@mui/icons-material/ViewList';
import TuneIcon from '@mui/icons-material/Tune';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
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
import StatusCard from './StatusCard';
import { devicesActions } from '../store';
import MapDefaultCamera from '../map/main/MapDefaultCamera';
import usePersistedState from '../common/util/usePersistedState';
import MapLiveRoutes from '../map/main/MapLiveRoutes';
import { useDeviceReadonly } from '../common/util/permissions';
import MapPositions from '../map/MapPositions';
import MapOverlay from '../map/overlay/MapOverlay';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import MapScale from '../map/MapScale';
import MapNotification from '../map/notification/MapNotification';
import EventsDrawer from './EventsDrawer';
import useFeatures from '../common/util/useFeatures';

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
  toolbar: {
    display: 'flex',
    padding: theme.spacing(0, 1),
    '& > *': {
      margin: theme.spacing(0, 1),
    },
  },
  deviceList: {
    flex: 1,
  },
  statusCard: {
    position: 'fixed',
    zIndex: 5,
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${theme.dimensions.drawerWidthDesktop} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: `calc(${theme.spacing(3)} + ${theme.dimensions.bottomBarHeight}px)`,
    },
    transform: 'translateX(-50%)',
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
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    width: theme.dimensions.drawerWidthTablet,
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const phone = useMediaQuery(theme.breakpoints.down('sm'));

  const features = useFeatures();

  const [mapOnSelect] = usePersistedState('mapOnSelect', false);

  const [mapLiveRoutes] = usePersistedState('mapLiveRoutes', false);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.positions.items);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find((position) => selectedDeviceId && position.deviceId === selectedDeviceId);

  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const [filteredDevices, setFilteredDevices] = useState([]);

  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterStatuses, setFilterStatuses] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);

  const filterRef = useRef();
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const [devicesOpen, setDevicesOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);

  const eventHandler = useCallback(() => setEventsOpen(true), [setEventsOpen]);
  const eventsAvailable = useSelector((state) => !!state.events.items.length);

  const handleClose = () => {
    setDevicesOpen(!devicesOpen);
  };

  const deviceStatusCount = (status) => Object.values(devices).filter((d) => d.status === status).length;

  useEffect(() => setDevicesOpen(desktop), [desktop]);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);

  const deviceGroups = (device) => {
    const groupIds = [];
    let { groupId } = device;
    while (groupId) {
      groupIds.push(groupId);
      groupId = groups[groupId].groupId;
    }
    return groupIds;
  };

  useEffect(() => {
    const filtered = Object.values(devices)
      .filter((device) => !filterStatuses.length || filterStatuses.includes(device.status))
      .filter((device) => !filterGroups.length || deviceGroups(device).some((id) => filterGroups.includes(id)))
      .filter((device) => {
        const keyword = filterKeyword.toLowerCase();
        return [device.name, device.uniqueId, device.phone, device.model, device.contact].some((s) => s && s.toLowerCase().includes(keyword));
      });
    switch (filterSort) {
      case 'name':
        filtered.sort((device1, device2) => device1.name.localeCompare(device2.name));
        break;
      case 'lastUpdate':
        filtered.sort((device1, device2) => {
          const time1 = device1.lastUpdate ? moment(device1.lastUpdate).valueOf() : 0;
          const time2 = device2.lastUpdate ? moment(device2.lastUpdate).valueOf() : 0;
          return time2 - time1;
        });
        break;
      default:
        break;
    }
    if (filterSort === 'lastUpdate') {
      filtered.sort((device1, device2) => {
        const time1 = device1.lastUpdate ? moment(device1.lastUpdate).valueOf() : 0;
        const time2 = device2.lastUpdate ? moment(device2.lastUpdate).valueOf() : 0;
        return time2 - time1;
      });
    }
    setFilteredDevices(filtered);
    setFilteredPositions(filterMap
      ? filtered.map((device) => positions[device.id]).filter(Boolean)
      : Object.values(positions));
  }, [devices, positions, filterKeyword, filterStatuses, filterGroups, filterSort, filterMap]);

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
        onClick={handleClose}
        disableElevation
      >
        <ListIcon />
        <div className={classes.sidebarToggleText}>{t('deviceTitle')}</div>
      </Button>
      <Paper square elevation={3} className={`${classes.sidebar} ${!devicesOpen && classes.sidebarCollapsed}`}>
        <Paper square elevation={3} className={classes.toolbarContainer}>
          <Toolbar className={classes.toolbar} disableGutters>
            {!desktop && (
              <IconButton edge="start" sx={{ mr: 2 }} onClick={handleClose}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <OutlinedInput
              ref={filterRef}
              placeholder={t('sharedSearchDevices')}
              value={filterKeyword}
              onChange={(event) => setFilterKeyword(event.target.value)}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton size="small" edge="end" onClick={() => setFilterAnchorEl(filterRef.current)}>
                    <Badge color="info" variant="dot" invisible={!filterStatuses.length && !filterGroups.length}>
                      <TuneIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </InputAdornment>
              )}
              size="small"
              fullWidth
            />
            <Popover
              open={!!filterAnchorEl}
              anchorEl={filterAnchorEl}
              onClose={() => setFilterAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <div className={classes.filterPanel}>
                <FormControl>
                  <InputLabel>{t('deviceStatus')}</InputLabel>
                  <Select
                    label={t('deviceStatus')}
                    value={filterStatuses}
                    onChange={(e) => setFilterStatuses(e.target.value)}
                    multiple
                  >
                    <MenuItem value="online">{`${t('deviceStatusOnline')} (${deviceStatusCount('online')})`}</MenuItem>
                    <MenuItem value="offline">{`${t('deviceStatusOffline')} (${deviceStatusCount('offline')})`}</MenuItem>
                    <MenuItem value="unknown">{`${t('deviceStatusUnknown')} (${deviceStatusCount('unknown')})`}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('settingsGroups')}</InputLabel>
                  <Select
                    label={t('settingsGroups')}
                    value={filterGroups}
                    onChange={(e) => setFilterGroups(e.target.value)}
                    multiple
                  >
                    {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                      <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel>{t('sharedSortBy')}</InputLabel>
                  <Select
                    label={t('sharedSortBy')}
                    value={filterSort}
                    onChange={(e) => setFilterSort(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">{'\u00a0'}</MenuItem>
                    <MenuItem value="name">{t('sharedName')}</MenuItem>
                    <MenuItem value="lastUpdate">{t('deviceLastUpdate')}</MenuItem>
                  </Select>
                </FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={filterMap} onChange={(e) => setFilterMap(e.target.checked)} />}
                    label={t('sharedFilterMap')}
                  />
                </FormGroup>
              </div>
            </Popover>
            <IconButton onClick={() => navigate('/settings/device')} disabled={deviceReadonly}>
              <AddIcon />
            </IconButton>
            {desktop && (
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            )}
          </Toolbar>
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
        <div className={classes.statusCard}>
          <StatusCard
            deviceId={selectedDeviceId}
            onClose={() => dispatch(devicesActions.select(null))}
          />
        </div>
      )}
    </div>
  );
};

export default MainPage;
