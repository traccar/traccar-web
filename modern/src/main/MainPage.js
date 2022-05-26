import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Toolbar, TextField, IconButton, Button,
} from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ListIcon from '@mui/icons-material/ViewList';

import { useDispatch, useSelector } from 'react-redux';
import DevicesList from './DevicesList';
import Map from '../map/core/Map';
import MapSelectedDevice from '../map/main/MapSelectedDevice';
import MapAccuracy from '../map/main/MapAccuracy';
import MapGeofence from '../map/main/MapGeofence';
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
    color: '#777777',
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const phone = useMediaQuery(theme.breakpoints.down('sm'));

  const [mapLiveRoutes] = usePersistedState('mapLiveRoutes', false);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => Object.values(state.positions.items));

  const [searchKeyword, setSearchKeyword] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleClose = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => setCollapsed(!desktop), [desktop]);

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <Map>
        <MapGeofence />
        <MapAccuracy />
        {mapLiveRoutes && <MapLiveRoutes />}
        <MapPositions positions={positions} onClick={onClick} />
        <MapDefaultCamera />
        <MapSelectedDevice />
        <PoiMap />
      </Map>
      <MapCurrentLocation />
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
      <Paper square elevation={3} className={`${classes.sidebar} ${collapsed && classes.sidebarCollapsed}`}>
        <Paper square elevation={3} className={classes.toolbarContainer}>
          <Toolbar className={classes.toolbar} disableGutters>
            {!desktop && (
              <IconButton edge="start" sx={{ mr: 2 }} onClick={handleClose}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <TextField
              fullWidth
              name="searchKeyword"
              value={searchKeyword}
              autoComplete="searchKeyword"
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder={t('sharedSearchDevices')}
            />
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
          <DevicesList filter={searchKeyword} />
        </div>
      </Paper>
      {desktop && (
        <div className={classes.bottomMenu}>
          <BottomMenu />
        </div>
      )}
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
