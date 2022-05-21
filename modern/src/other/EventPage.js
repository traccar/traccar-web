import React, { useState } from 'react';

import {
  makeStyles, Typography, AppBar, Toolbar, IconButton,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useHistory, useParams } from 'react-router-dom';
import ContainerDimensions from 'react-container-dimensions';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import Map from '../map/core/Map';
import PositionsMap from '../map/PositionsMap';

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
  const history = useHistory();
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
          <IconButton color="inherit" edge="start" onClick={() => history.push('/')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{t('positionEvent')}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.mapContainer}>
        <ContainerDimensions>
          <Map>
            {position && <PositionsMap positions={[position]} />}
          </Map>
        </ContainerDimensions>
      </div>
    </div>
  );
};

export default EventPage;
