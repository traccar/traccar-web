import React from 'react';
import {
  Divider, Typography, IconButton, useMediaQuery, Toolbar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: dimensions.drawerWidthTablet,
    },
    [theme.breakpoints.down('sm')]: {
      height: dimensions.drawerHeightPhone,
    },
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

  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Drawer
          anchor={isPhone ? 'bottom' : 'left'}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{t('sharedGeofences')}</Typography>
          </Toolbar>
          <Divider />
          <GeofencesList />
        </Drawer>
        <div className={classes.mapContainer}>
          <MapView>
            <MapCurrentLocation />
            <MapGeofenceEdit />
          </MapView>
        </div>
      </div>
    </div>
  );
};

export default GeofencesPage;
