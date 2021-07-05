import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, withWidth, Paper, Toolbar, Grid, TextField, IconButton } from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import DevicesList from './DevicesList';
import MainToolbar from './MainToolbar';
import Map from './map/Map';
import SelectedDeviceMap from './map/SelectedDeviceMap';
import AccuracyMap from './map/AccuracyMap';
import GeofenceMap from './map/GeofenceMap';
import CurrentPositionsMap from './map/CurrentPositionsMap';
import CurrentLocationMap from './map/CurrentLocationMap';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  listContainer: {
    zIndex: 1301,
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
  searchBox: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(10.5),
    width: theme.dimensions.drawerWidthDesktop,
    borderRadius: '0px',
    [theme.breakpoints.down("md")]: {
      top: theme.spacing(7),
      left: '0px',
      width: '100%'
    }  
  },
  searchToolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  deviceList: {
    position: 'absolute',
    left: theme.spacing(1.5),
    top: theme.spacing(20),
    width: theme.dimensions.drawerWidthDesktop,
    borderRadius: '0px',
    height: '100%',
    maxHeight: `calc(100vh - ${theme.spacing(23)}px)`,
    overflowY: 'auto',
    [theme.breakpoints.down("md")]: {
      top: theme.spacing(14),
      left: '0px',
      width: '100%',
      height: `calc(100vh - ${theme.spacing(14)}px)`,
      maxHeight: '100%'
    }  
  }
}));

const MainPage = ({ width }) => {
  const classes = useStyles();
  const history = useHistory();

  const [deviceName, setDeviceName] = useState();

  const theme = useTheme();
  const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

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
      <div className={classes.listContainer}>
        <Paper className={classes.searchBox}>
          <Toolbar className={classes.searchToolbar} disableGutters>
            <Grid container direction="row" alignItems="center" spacing={2}>
              {matchesMD && <Grid item> 
                <IconButton>
                  <ArrowBackIcon />
                </IconButton>            
              </Grid>}
              <Grid item xs>
                <TextField
                  fullWidth
                  name='deviceName'
                  value={deviceName || ''}
                  autoComplete='deviceName'
                  autoFocus
                  onChange={event => setDeviceName(event.target.value)}
                  placeholder="Search Devices"
                  variant='filled' />
              </Grid>
              <Grid item>
                <IconButton onClick={() => history.push('/device')}>
                  <AddIcon />
                </IconButton>
              </Grid>
              {!matchesMD && <Grid item>
                <IconButton>
                  <CloseIcon />
                </IconButton>
              </Grid>}
            </Grid>
          </Toolbar>
        </Paper>
        <Paper className={classes.deviceList}>
          <DevicesList />
        </Paper>
      </div>
    </div>
  );
}

export default withWidth()(MainPage);
