import { useId, useEffect } from 'react';
import { useSelector } from 'react-redux';
import circle from '@turf/circle';
import { useTheme } from '@mui/styles';
import { map } from '../core/MapView';

const MapAccuracy = () => {
  const id = useId();

  const theme = useTheme();

  const positions = useSelector((state) => ({
    type: 'FeatureCollection',
    features: Object.values(state.positions.items)
      .filter((position) => position.accuracy > 0)
      .map((position) => circle([position.longitude, position.latitude], position.accuracy * 0.001)),
  }));

  useEffect(() => {
    map.addSource(id, {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });
    map.addLayer({
      source: id,
      id,
      type: 'fill',
      filter: [
        'all',
        ['==', '$type', 'Polygon'],
      ],
      paint: {
        'fill-color': theme.palette.colors.geometry,
        'fill-outline-color': theme.palette.colors.geometry,
        'fill-opacity': 0.25,
      },
    });

    return () => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    };
  }, []);

  useEffect(() => {
    map.getSource(id).setData(positions);
  }, [positions]);

  return null;
};

export default MapAccuracy;
