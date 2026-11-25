import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MapboxDraw from './MapDraw';
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
    return () => map.removeControl(draw);
  }, [draw, theme.direction]);

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

  return null;
};

export default MapPointCreate;
