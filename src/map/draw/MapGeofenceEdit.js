import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';
import { geofenceToFeature, geometryToArea } from '../core/mapUtil';
import { errorsActions, geofencesActions } from '../../store';
import { useCatchCallback } from '../../reactHelper';
import theme from './theme';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    line_string: true,
    trash: true,
  },
  userProperties: true,
  styles: [...theme, {
    id: 'gl-draw-title',
    type: 'symbol',
    filter: ['all'],
    layout: {
      'text-field': '{user_name}',
      'text-font': ['Roboto Regular'],
      'text-size': 12,
    },
    paint: {
      'text-halo-color': 'white',
      'text-halo-width': 1,
    },
  }],
});

const MapGeofenceEdit = ({ selectedGeofenceId }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const geofences = useSelector((state) => state.geofences.items);

  const refreshGeofences = useCatchCallback(async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    } else {
      throw Error(await response.text());
    }
  }, [dispatch]);

  useEffect(() => {
    refreshGeofences();

    map.addControl(draw, 'top-left');
    return () => map.removeControl(draw);
  }, [refreshGeofences]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      const newItem = { name: '', area: geometryToArea(feature.geometry) };
      draw.delete(feature.id);
      try {
        const response = await fetch('/api/geofences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (response.ok) {
          const item = await response.json();
          navigate(`/settings/geofence/${item.id}`);
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };

    map.on('draw.create', listener);
    return () => map.off('draw.create', listener);
  }, [dispatch, navigate]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      try {
        const response = await fetch(`/api/geofences/${feature.id}`, { method: 'DELETE' });
        if (response.ok) {
          refreshGeofences();
        } else {
          throw Error(await response.text());
        }
      } catch (error) {
        dispatch(errorsActions.push(error.message));
      }
    };

    map.on('draw.delete', listener);
    return () => map.off('draw.delete', listener);
  }, [dispatch, refreshGeofences]);

  useEffect(() => {
    const listener = async (event) => {
      const feature = event.features[0];
      const item = Object.values(geofences).find((i) => i.id === feature.id);
      if (item) {
        const updatedItem = { ...item, area: geometryToArea(feature.geometry) };
        try {
          const response = await fetch(`/api/geofences/${feature.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedItem),
          });
          if (response.ok) {
            refreshGeofences();
          } else {
            throw Error(await response.text());
          }
        } catch (error) {
          dispatch(errorsActions.push(error.message));
        }
      }
    };

    map.on('draw.update', listener);
    return () => map.off('draw.update', listener);
  }, [dispatch, geofences, refreshGeofences]);

  useEffect(() => {
    draw.deleteAll();
    Object.values(geofences).forEach((geofence) => {
      draw.add(geofenceToFeature(theme, geofence));
    });
  }, [geofences]);

  useEffect(() => {
    if (selectedGeofenceId) {
      const feature = draw.get(selectedGeofenceId);
      let { coordinates } = feature.geometry;
      if (Array.isArray(coordinates[0][0])) {
        [coordinates] = coordinates;
      }
      const bounds = coordinates.reduce(
        (bounds, coordinate) => bounds.extend(coordinate),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[1]),
      );
      const canvas = map.getCanvas();
      map.fitBounds(bounds, { padding: Math.min(canvas.width, canvas.height) * 0.1 });
    }
  }, [selectedGeofenceId]);

  return null;
};

export default MapGeofenceEdit;
