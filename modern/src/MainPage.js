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

import DevicesList from './DevicesList';
import Map from './map/Map';
import SelectedDeviceMap from './map/SelectedDeviceMap';
import AccuracyMap from './map/AccuracyMap';
import GeofenceMap from './map/GeofenceMap';
import CurrentPositionsMap from './map/CurrentPositionsMap';
import CurrentLocationMap from './map/CurrentLocationMap';
import BottomMenu from './components/BottomMenu';
import { useTranslation } from './LocalizationProvider';
import PoiMap from './map/PoiMap';
import MapPadding from './map/MapPadding';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    bottom: 56,
    zIndex: 1301,
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
  paper: {
    zIndex: 1,
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
  sidebarToggle: {
    position: 'absolute',
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
}));

const MainPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();
  const t = useTranslation();

  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isPhone = useMediaQuery(theme.breakpoints.down('xs'));

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
        <CurrentPositionsMap />
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
        <Paper className={classes.paper} square elevation={3}>
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
            <IconButton onClick={() => history.push('/device')}>
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
      <BottomMenu />
    </div>
  );
};

export default MainPage;
