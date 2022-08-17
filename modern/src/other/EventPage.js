import React, { useState } from 'react';

import {
  Typography, AppBar, Toolbar, IconButton,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import MapPositions from '../map/MapPositions';
import MapGeofence from '../map/MapGeofence';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const EventPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const { id } = useParams();

  const [event, setEvent] = useState();
  const [position, setPosition] = useState();

  useEffectAsync(async () => {
    if (id) {
      const response = await fetch(`/api/events/${id}`);
      if (response.ok) {
        setEvent(await response.json());
      } else {
        throw Error(await response.text());
      }
    }
  }, [id]);

  useEffectAsync(async () => {
    if (event && event.positionId) {
      const response = await fetch(`/api/positions?id=${event.positionId}`);
      if (response.ok) {
        const positions = await response.json();
        if (positions.length > 0) {
          setPosition(positions[0]);
        }
      } else {
        throw Error(await response.text());
      }
    }
  }, [event]);

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{t('positionEvent')}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.mapContainer}>
        <MapView>
          <MapGeofence />
          {position && <MapPositions positions={[position]} />}
        </MapView>
        {position && <MapCamera latitude={position.latitude} longitude={position.longitude} />}
      </div>
    </div>
  );
};

export default EventPage;
