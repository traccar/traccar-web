import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MapboxDraw from './MapDraw';
import MapDrawHint from './MapDrawHint';
import drawTheme from './theme';
import { map } from '../core/MapView';
import { fromMapCoordinates } from '../core/mapUtil';
import { messagesActions } from '../../store';
import { useTranslation } from '../../common/components/LocalizationProvider';
import fetchOrThrow from '../../common/util/fetchOrThrow';

const MapPointCreate = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const t = useTranslation();
  const [hintAnchor, setHintAnchor] = useState(null);
  const [hintDismissed, setHintDismissed] = useState(false);

  const draw = useMemo(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: { point: true },
        styles: drawTheme,
      }),
    [],
  );

  useEffect(() => {
    map.addControl(draw, theme.direction === 'rtl' ? 'top-right' : 'top-left');
    setHintAnchor(map.getContainer().querySelector('.mapbox-gl-draw_point'));

    const dismissHint = () => setHintDismissed(true);
    map.on('draw.modechange', dismissHint);
    map.on('draw.selectionchange', dismissHint);
    return () => {
      map.off('draw.modechange', dismissHint);
      map.off('draw.selectionchange', dismissHint);
      map.removeControl(draw);
    };
  }, [draw, theme.direction]);

  useEffect(() => {
    hintAnchor?.setAttribute('title', `${t('sharedCreatePoint')} (1)`);
  }, [hintAnchor, t]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      const [longitude, latitude] = fromMapCoordinates(...feature.geometry.coordinates);
      const newItem = { name: t('sharedPoint'), latitude, longitude };
      draw.delete(feature.id);
      try {
        const response = await fetchOrThrow('api/points', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        const item = await response.json();
        navigate(`/settings/point/${item.id}`);
      } catch (error) {
        dispatch(messagesActions.push(error.message));
      }
    };

    map.on('draw.create', listener);
    return () => map.off('draw.create', listener);
  }, [dispatch, navigate, draw, t]);

  return <MapDrawHint anchorEl={hintAnchor} title={t('sharedPointHint')} open={!hintDismissed} />;
};

export default MapPointCreate;
