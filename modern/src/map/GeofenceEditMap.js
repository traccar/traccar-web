import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import theme from '@mapbox/mapbox-gl-draw/src/lib/theme';
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { map } from './Map';
import { geofenceToFeature, geometryToArea } from './mapUtil';
import { geofencesActions } from '../store';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
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

const GeofenceEditMap = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const geofences = useSelector((state) => Object.values(state.geofences.items));

  const refreshGeofences = async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    }
  };

  useEffect(() => {
    refreshGeofences();

    map.addControl(draw, 'top-left');

    map.on('draw.create', async (event) => {
      const feature = event.features[0];
      const newItem = { name: '', area: geometryToArea(feature.geometry) };
      draw.delete(feature.id);
      const response = await fetch('/api/geofences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const item = await response.json();
        history.push(`/geofence/${item.id}`);
      }
    });

    map.on('draw.delete', async (event) => {
      const feature = event.features[0];
      const response = await fetch(`/api/geofences/${feature.id}`, { method: 'DELETE' });
      if (response.ok) {
        refreshGeofences();
      }
    });

    map.on('draw.update', async (event) => {
      const feature = event.features[0];
      const item = geofences.find((i) => i.id === feature.id);
      if (item) {
        const updatedItem = { ...item, area: geometryToArea(feature.geometry) };
        const response = await fetch(`/api/geofences/${feature.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        });
        if (response.ok) {
          refreshGeofences();
        }
      }
    });

    return () => map.removeControl(draw);
  }, []);

  useEffect(() => {
    draw.deleteAll();
    geofences.forEach((geofence) => {
      draw.add(geofenceToFeature(geofence));
    });
  }, [geofences]);

  return null;
};

export default GeofenceEditMap;
