import { useCallback, useState } from 'react';

import {
  Typography, AppBar, Toolbar, IconButton,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import MapView from '../map/core/MapView';
import MapCamera from '../map/MapCamera';
import MapPositions from '../map/MapPositions';
import MapGeofence from '../map/MapGeofence';
import StatusCard from '../common/components/StatusCard';
import { formatNotificationTitle } from '../common/util/formatter';
import MapScale from '../map/MapScale';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    zIndex: 1,
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const EventPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const { id } = useParams();

  const [event, setEvent] = useState();
  const [position, setPosition] = useState();
  const [showCard, setShowCard] = useState(false);

  const formatType = (event) => formatNotificationTitle(t, {
    type: event.type,
    attributes: {
      alarms: event.attributes.alarm,
    },
  });

  const onMarkerClick = useCallback((positionId) => {
    setShowCard(Boolean(positionId));
  }, [setShowCard]);

  useEffectAsync(async () => {
    if (id) {
      const response = await fetchOrThrow(`/api/events/${id}`);
      setEvent(await response.json());
    }
  }, [id]);

  useEffectAsync(async () => {
    if (event && event.positionId) {
      const response = await fetchOrThrow(`/api/positions?id=${event.positionId}`);
      const positions = await response.json();
      if (positions.length > 0) {
        setPosition(positions[0]);
      }
    }
  }, [event]);

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="static" className={classes.toolbar}>
        <Toolbar>
          <IconButton color="inherit" edge="start" sx={{ mr: 2 }} onClick={() => navigate('/')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">{event && formatType(event)}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.mapContainer}>
        <MapView>
          <MapGeofence />
          {position && <MapPositions positions={[position]} onMarkerClick={onMarkerClick} titleField="fixTime" />}
        </MapView>
        <MapScale />
        {position && <MapCamera latitude={position.latitude} longitude={position.longitude} />}
        {position && showCard && (
          <StatusCard
            deviceId={position.deviceId}
            position={position}
            onClose={() => setShowCard(false)}
            disableActions
          />
        )}
      </div>
    </div>
  );
};

export default EventPage;
