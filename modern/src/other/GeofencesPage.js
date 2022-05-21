import React from 'react';
import {
  Divider, makeStyles, Typography, IconButton, useMediaQuery,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory } from 'react-router-dom';
import Map from '../map/core/Map';
import CurrentLocationMap from '../map/CurrentLocationMap';
import GeofenceEditMap from '../map/GeofenceEditMap';
import GeofencesList from './GeofencesList';
import { useTranslation } from '../common/components/LocalizationProvider';
import dimensions from '../common/theme/dimensions';

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
      width: dimensions.drawerWidthTablet,
    },
    [theme.breakpoints.down('xs')]: {
      height: dimensions.drawerHeightPhone,
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

const GeofencesPage = () => {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();

  const isPhone = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Drawer
          anchor={isPhone ? 'bottom' : 'left'}
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

export default GeofencesPage;
