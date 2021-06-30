import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useEffect } from 'react';

import { map } from './Map';
import { geofenceToFeature, geometryToArea } from './mapUtil';
import { useDispatch, useSelector } from 'react-redux';
import { geofencesActions } from '../store';
import { useHistory } from 'react-router-dom';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true,
  },
});

const GeofenceEditMap = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const geofences = useSelector(state => Object.values(state.geofences.items));

  const refreshGeofences = async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      dispatch(geofencesActions.refresh(await response.json()));
    }
  }

  useEffect(() => {
    refreshGeofences();

    map.addControl(draw, 'top-left');

    

    map.on('draw.create', async event => {
      const feature = event.features[0];
      const newItem = { name: '', area: geometryToArea(feature.geometry) };
      draw.delete(feature.id);
      const response = await fetch(`/api/geofences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        const item = await response.json();
        history.push(`/geofence/${item.id}`);
      }
    });

    map.on('draw.delete', async event => {
      const feature = event.features[0];
      const response = await fetch(`/api/geofences/${feature.id}`, { method: 'DELETE' });
      if (response.ok) {
        refreshGeofences();
      }
    });

    map.on('draw.update', async event => {
      const feature = event.features[0];
      const item = geofences.find(i => i.id === feature.id);
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
    for (const geofence of geofences) {
      draw.add(geofenceToFeature(geofence));
    }
  }, [geofences]);

  return null;
}

export default GeofenceEditMap;
