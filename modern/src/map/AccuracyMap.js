import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import circle from '@turf/circle';

import { map } from './Map';

const AccuracyMap = () => {
  const id = 'accuracy';

  const positions = useSelector(state => ({
    type: 'FeatureCollection',
    features: Object.values(state.positions.items).filter(position => position.accuracy > 0).map(position =>
      circle([position.longitude, position.latitude], position.accuracy * 0.001)
    ),
  }));

  useEffect(() => {
    map.addSource(id, {
      'type': 'geojson',
      'data': {
        type: 'FeatureCollection',
        features: []
      }
    });
    map.addLayer({
      'source': id,
      'id': id,
      'type': 'fill',
      'filter': [
         'all',
         ['==', '$type', 'Polygon'],
      ],
      'paint': {
         'fill-color':'#3bb2d0',
         'fill-outline-color':'#3bb2d0',
         'fill-opacity':0.25,
      },
    });

    return () => {
      map.removeLayer(id);
      map.removeSource(id);
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData(positions);
  }, [positions]);

  return null;
}

export default AccuracyMap;
