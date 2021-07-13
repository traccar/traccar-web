import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, Paper, Toolbar, Grid, TextField, IconButton, Button,
} from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ListIcon from '@material-ui/icons/List';
import ReplayIcon from '@material-ui/icons/Replay';
import DescriptionIcon from '@material-ui/icons/Description';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import PersonIcon from '@material-ui/icons/Person';

import DevicesList from './DevicesList';
import MainToolbar from './MainToolbar';
import Map from './map/Map';
import SelectedDeviceMap from './map/SelectedDeviceMap';
import AccuracyMap from './map/AccuracyMap';
import GeofenceMap from './map/GeofenceMap';
import CurrentPositionsMap from './map/CurrentPositionsMap';
import CurrentLocationMap from './map/CurrentLocationMap';
import t from './common/localization';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      height: 250,
    },
    overflow: 'hidden',
  },
  listContainer: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(10.5),
    width: theme.dimensions.drawerWidthDesktop,
    zIndex: 1301,
    height: '100%',
    maxHeight: `calc(100vh - ${theme.spacing(20)}px)`,
    [theme.breakpoints.down('md')]: {
      top: theme.spacing(7),
      left: '0px',
      width: '100%',
      maxHeight: `calc(100vh - ${theme.spacing(14)}px)`,
    },
  },
  paper: {
    borderRadius: '0px',
  },
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  deviceList: {
    height: '100%',
  },
  collapsed: {
    transform: `translateX(-${360 + 16}px)`,
    transition: 'transform .5s ease',
    [theme.breakpoints.down('md')]: {
      transform: 'translateX(-100vw)',
    },
  },
  uncollapsed: {
    transform: `translateX(${theme.spacing(1.5)})`,
    transition: 'transform .5s ease',
    [theme.breakpoints.down('md')]: {
      transform: 'translateX(0)',
    },
  },
  deviceButton: {
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(10.5),
    borderRadius: '0px',
    [theme.breakpoints.down('md')]: {
      left: theme.spacing(0),
      top: theme.spacing(7),
    },
  },
  deviceButtonBackground: {
    backgroundColor: 'white',
    color: '#777777',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
  bottomMenuContainer: {
    position: 'absolute',
    left: theme.spacing(1.5),
    bottom: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    zIndex: 1301,
    [theme.breakpoints.down('md')]: {
      bottom: theme.spacing(0),
      left: '0px',
      width: '100%',
    },
  },
  menuButton: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconText: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
    color: '#222222',
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const [deviceName, setDeviceName] = useState();
  const [collapsed, setCollapsed] = useState(false);

  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={classes.root}>
      <MainToolbar />
      <Map>
        <CurrentLocationMap />
        <GeofenceMap />
        <AccuracyMap />
        <CurrentPositionsMap />
        <SelectedDeviceMap />
      </Map>
      {collapsed
        && (
        <Button
          variant="contained"
          color={matchesMD ? 'secondary' : 'primary'}
          classes={{ containedPrimary: classes.deviceButtonBackground }}
          className={classes.deviceButton}
          onClick={handleClose}
          startIcon={<ListIcon />}
          disableElevation
        >
          {!matchesMD ? t('deviceTitle') : ''}
        </Button>
        )}
      <div className={`${classes.listContainer} ${collapsed ? classes.collapsed : classes.uncollapsed}`}>
        <Grid container direction="column" spacing={matchesMD ? 0 : 2} style={{ height: '100%' }}>
          <Grid item>
            <Paper className={classes.paper}>
              <Toolbar className={classes.toolbar} disableGutters>
                <Grid container direction="row" alignItems="center" spacing={2}>
                  {matchesMD && (
                  <Grid item>
                    <IconButton onClick={handleClose}>
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>
                  )}
                  <Grid item xs>
                    <TextField
                      fullWidth
                      name="deviceName"
                      value={deviceName || ''}
                      autoComplete="deviceName"
                      autoFocus
                      onChange={(event) => setDeviceName(event.target.value)}
                      placeholder="Search Devices"
                      variant="filled"
                    />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => history.push('/device')}>
                      <AddIcon />
                    </IconButton>
                  </Grid>
                  {!matchesMD && (
                  <Grid item>
                    <IconButton onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                  )}
                </Grid>
              </Toolbar>
            </Paper>
          </Grid>
          <Grid item xs>
            <Paper className={`${classes.deviceList} ${classes.paper}`}>
              <DevicesList />
            </Paper>
          </Grid>
        </Grid>
      </div>
      <div className={classes.bottomMenuContainer}>
        <Paper className={classes.paper}>
          <Toolbar className={classes.toolbar} disableGutters>
            <Grid container justify="space-around">
              <Grid item>
                <IconButton classes={{ label: classes.menuButton }}>
                  <ReplayIcon />
                  <span className={classes.iconText}>{t('reportReplay')}</span>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton classes={{ label: classes.menuButton }}>
                  <DescriptionIcon />
                  <span className={classes.iconText}>{t('reportTitle')}</span>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton classes={{ label: classes.menuButton }}>
                  <ShuffleIcon />
                  <span className={classes.iconText}>Options</span>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton classes={{ label: classes.menuButton }}>
                  <PersonIcon />
                  <span className={classes.iconText}>{t('settingsUser')}</span>
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </Paper>
      </div>
    </div>
  );
};

export default MainPage;
