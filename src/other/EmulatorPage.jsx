import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider, Typography, IconButton, useMediaQuery, Toolbar,
  List,
  ListItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import MapView from '../map/core/MapView';
import MapCurrentLocation from '../map/MapCurrentLocation';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapGeocoder from '../map/geocoder/MapGeocoder';
import SelectField from '../common/components/SelectField';
import { devicesActions } from '../store';
import MapPositions from '../map/MapPositions';
import { useCatch } from '../reactHelper';

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
  drawer: {
    zIndex: 1,
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: theme.dimensions.drawerWidthDesktop,
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.dimensions.drawerHeightPhone,
    },
  },
  mapContainer: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const EmulatorPage = () => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();

  const isPhone = useMediaQuery(theme.breakpoints.down('sm'));

  const devices = useSelector((state) => state.devices.items);
  const deviceId = useSelector((state) => state.devices.selectedId);
  const positions = useSelector((state) => state.session.positions);

  const handleClick = useCatch(async (latitude, longitude) => {
    if (deviceId) {
      let response;
      if (window.location.protocol === 'https:') {
        const formData = new FormData();
        formData.append('id', devices[deviceId].uniqueId);
        formData.append('lat', latitude);
        formData.append('lon', longitude);
        response = await fetch(window.location.origin, {
          method: 'POST',
          body: formData,
        });
      } else {
        const params = new URLSearchParams();
        params.append('id', devices[deviceId].uniqueId);
        params.append('lat', latitude);
        params.append('lon', longitude);
        response = await fetch(`http://${window.location.hostname}:5055?${params.toString()}`, {
          method: 'POST',
          mode: 'no-cors',
        });
      }
      if (!response.ok) {
        throw Error(await response.text());
      }
    }
  });

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Drawer
          className={classes.drawer}
          anchor={isPhone ? 'bottom' : 'left'}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <Toolbar>
            <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>{t('sharedEmulator')}</Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem>
              <SelectField
                label={t('reportDevice')}
                data={Object.values(devices).sort((a, b) => a.name.localeCompare(b.name))}
                value={deviceId}
                onChange={(e) => dispatch(devicesActions.selectId(e.target.value))}
                fullWidth
              />
            </ListItem>
          </List>
        </Drawer>
        <div className={classes.mapContainer}>
          <MapView>
            <MapPositions
              positions={Object.values(positions)}
              onClick={handleClick}
              showStatus
            />
          </MapView>
          <MapCurrentLocation />
          <MapGeocoder />
        </div>
      </div>
    </div>
  );
};

export default EmulatorPage;
