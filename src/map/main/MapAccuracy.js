import { useId, useEffect } from 'react';
import circle from '@turf/circle';
import { useTheme } from '@mui/material/styles';
import { map } from '../core/MapView';
import { getCoordinateWithMapStyle, useSelectedMapStyle } from "../core/mapUtil.js";

const MapAccuracy = ({ positions, convertedPositions }) => {
  const id = useId();

  const theme = useTheme();

  const [selectedMapStyle] = useSelectedMapStyle();

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
        'fill-color': theme.palette.geometry.main,
        'fill-outline-color': theme.palette.geometry.main,
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
    map.getSource(id)?.setData({
      type: 'FeatureCollection',
      features: positions
        .filter((position) => position.accuracy > 0)
        .filter((position) => position.id in convertedPositions)
        .map((position) => circle(getCoordinateWithMapStyle(position, convertedPositions[position.id], selectedMapStyle), position.accuracy * 0.001)),
    });
  }, [positions]);

  return null;
};

export default MapAccuracy;
