import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, Paper, Toolbar, TextField, IconButton, Button,
} from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ListIcon from '@material-ui/icons/ViewList';

import { useDispatch, useSelector } from 'react-redux';
import DevicesList from './DevicesList';
import Map from '../map/core/Map';
import SelectedDeviceMap from '../map/main/SelectedDeviceMap';
import AccuracyMap from '../map/main/AccuracyMap';
import GeofenceMap from '../map/main/GeofenceMap';
import CurrentPositionsMap from '../map/main/CurrentPositionsMap';
import CurrentLocationMap from '../map/CurrentLocationMap';
import BottomMenu from '../common/components/BottomMenu';
import { useTranslation } from '../common/components/LocalizationProvider';
import PoiMap from '../map/main/PoiMap';
import MapPadding from '../map/MapPadding';
import StatusCard from './StatusCard';
import { devicesActions } from '../store';
import DefaultCameraMap from '../map/main/DefaultCameraMap';
import usePersistedState from '../common/util/usePersistedState';
import LiveRoutesMap from '../map/main/LiveRoutesMap';
import { useDeviceReadonly } from '../common/util/permissions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 3,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    bottom: theme.dimensions.bottomBarHeight,
    transition: 'transform .5s ease',
    backgroundColor: 'white',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
  sidebarCollapsed: {
    transform: `translateX(-${theme.dimensions.drawerWidthDesktop})`,
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
      transform: 'translateX(-100vw)',
    },
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
    [theme.breakpoints.up('sm')]: {
      left: `calc(50% + ${theme.dimensions.drawerWidthDesktop} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('sm')]: {
      left: '50%',
      bottom: theme.spacing(3) + theme.dimensions.bottomBarHeight,
    },
    transform: 'translateX(-50%)',
  },
  sidebarToggle: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(3),
    borderRadius: '0px',
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
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
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
  const isPhone = useMediaQuery(theme.breakpoints.down('xs'));

  const [mapLiveRoutes] = usePersistedState('mapLiveRoutes', false);

  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const handleClose = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => setCollapsed(isTablet), [isTablet]);

  return (
    <div className={classes.root}>
      <Map>
        {!isTablet && <MapPadding left={parseInt(theme.dimensions.drawerWidthDesktop, 10)} />}
        <CurrentLocationMap />
        <GeofenceMap />
        <AccuracyMap />
        {mapLiveRoutes && <LiveRoutesMap />}
        <CurrentPositionsMap />
        <DefaultCameraMap />
        <SelectedDeviceMap />
        <PoiMap />
      </Map>
      <Button
        variant="contained"
        color={isPhone ? 'secondary' : 'primary'}
        classes={{ containedPrimary: classes.sidebarToggleBg }}
        className={classes.sidebarToggle}
        onClick={handleClose}
        disableElevation
      >
        <ListIcon />
        <div className={classes.sidebarToggleText}>{t('deviceTitle')}</div>
      </Button>
      <Paper square elevation={3} className={`${classes.sidebar} ${collapsed && classes.sidebarCollapsed}`}>
        <Paper square elevation={3}>
          <Toolbar className={classes.toolbar} disableGutters>
            {isTablet && (
              <IconButton onClick={handleClose}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <TextField
              fullWidth
              name="searchKeyword"
              value={searchKeyword}
              autoComplete="searchKeyword"
              autoFocus
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder={t('sharedSearchDevices')}
              variant="filled"
            />
            <IconButton onClick={() => history.push('/settings/device')} disabled={deviceReadonly}>
              <AddIcon />
            </IconButton>
            {!isTablet && (
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
      {!isPhone && !isTablet && (
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
