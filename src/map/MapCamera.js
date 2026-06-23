import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { map } from './core/MapView';
import { toMapCoordinates } from './core/mapUtil';

const MapCamera = ({ latitude, longitude, positions, coordinates }) => {
  useEffect(() => {
    if (coordinates || positions) {
      const coords = coordinates
        ? coordinates.map(([longitude, latitude]) => toMapCoordinates(longitude, latitude))
        : positions.map((item) => toMapCoordinates(item.longitude, item.latitude));
      if (coords.length) {
        const bounds = coords.reduce(
          (bounds, item) => bounds.extend(item),
          new maplibregl.LngLatBounds(coords[0], coords[0]),
        );
        const canvas = map.getCanvas();
        map.fitBounds(bounds, {
          padding: Math.min(canvas.width, canvas.height) * 0.1,
          duration: 0,
        });
      }
    } else {
      map.jumpTo({
        center: toMapCoordinates(longitude, latitude),
        zoom: Math.max(map.getZoom(), 10),
      });
    }
  }, [latitude, longitude, positions, coordinates]);

  return null;
};

export default MapCamera;
