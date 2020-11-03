import React from 'react';
import { isWidthUp, makeStyles, withWidth } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    }
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      height: 250,
    }
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const MainPage = ({ width }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp('sm', width) ? 'left' : 'bottom'}
          variant='permanent'
          classes={{ paper: classes.drawerPaper }}>
          <DevicesList />
        </Drawer>
        <div className={classes.mapContainer}>
          <ContainerDimensions>
            <Map>
              <CurrentLocationMap />
              <GeofenceMap />
              <AccuracyMap />
              <CurrentPositionsMap />
              <SelectedDeviceMap />
            </Map>
          </ContainerDimensions>
        </div>
      </div>
    </div>
  );
}

export default withWidth()(MainPage);
