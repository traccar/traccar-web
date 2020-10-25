import wellknown from 'wellknown';
import { useEffect, useState } from 'react';

import { map } from './Map';
import { useEffectAsync } from '../reactHelper';
import { reverseCoordinates } from './mapUtil';

const GeofenceMap = () => {
  const id = 'geofences';

  const [geofences, setGeofences] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/geofences');
    if (response.ok) {
      setGeofences(await response.json());
    }
  }, []);

  useEffect(() => {
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addLayer({
      'id': id,
      'type': 'fill',
      'source': id,
      'layout': {},
      'paint': {
      'fill-color': '#088',
      'fill-opacity': 0.8
      }
    });

    return () => {
      map.removeLayer(id);
      map.removeSource(id);
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData({
      type: 'FeatureCollection',
      features: geofences.map(item => [item.name, reverseCoordinates(wellknown(item.area))]).filter(([, geometry]) => !!geometry).map(([name, geometry]) => ({
        type: 'Feature',
        geometry: geometry,
        properties: { name },
      })),
    });
  }, [geofences]);

  return null;
}

export default GeofenceMap;
