import React from 'react';
import { isWidthUp, makeStyles, withWidth } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import MainToolbar from './MainToolbar';
import Map from './map/Map';
import CurrentLocationMap from './map/CurrentLocationMap';
import GeofenceEditMap from './map/GeofenceEditMap';
import GeofencesList from './GeofencesList';

const useStyles = makeStyles((theme) => ({
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
    },
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      height: 250,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const GeofencesPage = ({ width }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp('sm', width) ? 'left' : 'bottom'}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <GeofencesList />
        </Drawer>
        <div className={classes.mapContainer}>
          <ContainerDimensions>
            <Map>
              <CurrentLocationMap />
              <GeofenceEditMap />
            </Map>
          </ContainerDimensions>
        </div>
      </div>
    </div>
  );
};

export default withWidth()(GeofencesPage);
