import React from 'react';
import {
  Divider, isWidthUp, makeStyles, withWidth, Typography, IconButton,
} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import Map from './map/Map';
import CurrentLocationMap from './map/CurrentLocationMap';
import GeofenceEditMap from './map/GeofenceEditMap';
import GeofencesList from './GeofencesList';
import { useTranslation } from './LocalizationProvider';

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
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const GeofencesPage = ({ width }) => {
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp('sm', width) ? 'left' : 'bottom'}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={() => history.goBack()}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {t('sharedGeofences')}
            </Typography>
          </div>
          <Divider />
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
