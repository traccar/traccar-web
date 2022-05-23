import React from 'react';
import {
  Divider, makeStyles, Typography, IconButton, useMediaQuery,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useNavigate } from 'react-router-dom';
import Map from '../map/core/Map';
import MapCurrentLocation from '../map/MapCurrentLocation';
import MapGeofenceEdit from '../map/MapGeofenceEdit';
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
  const navigate = useNavigate();
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
            <IconButton onClick={() => navigate(-1)}>
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
          <Map>
            <MapCurrentLocation />
            <MapGeofenceEdit />
          </Map>
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
