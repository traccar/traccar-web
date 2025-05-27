import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { map } from './core/MapView';
import { getCoordinateWithMapStyle } from "./core/mapUtil.js";
import { useSelectedMapStyle } from "./MapStyleProvider.jsx";

const MapCamera = ({
  latitude, longitude, positions, coordinates,
}) => {
  const [selectedMapStyle] = useSelectedMapStyle();
  useEffect(() => {
    if (coordinates || positions) {
      if (!coordinates) {
        coordinates = positions.map((item) => getCoordinateWithMapStyle(item, selectedMapStyle));
      }
      if (coordinates.length) {
        const bounds = coordinates.reduce((bounds, item) => bounds.extend(item), new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
        const canvas = map.getCanvas();
        map.fitBounds(bounds, {
          padding: Math.min(canvas.width, canvas.height) * 0.1,
          duration: 0,
        });
      }
    } else {
      map.jumpTo({
        center: getCoordinateWithMapStyle({ latitude, longitude }, selectedMapStyle),
        zoom: Math.max(map.getZoom(), 10),
      });
    }
  }, [latitude, longitude, positions, coordinates]);

  return null;
};

export default MapCamera;
