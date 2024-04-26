import { useEffect } from 'react';
import { useAttributePreference } from '../../common/util/preferences';
import { map } from '../core/MapView';
import useMapOverlays from './useMapOverlays';

const MapOverlay = () => {
  const mapOverlays = useMapOverlays();
  const activeMapOverlays = useAttributePreference('activeMapOverlays');
  const availableActiveMapOverlays = mapOverlays.filter((overlay) => overlay.available && activeMapOverlays.includes(overlay.id));

  useEffect(() => {
    if (availableActiveMapOverlays) {
      availableActiveMapOverlays.forEach((mapOverlay) => {
        const { id } = mapOverlay;
        map.addSource(id, mapOverlay.source);
        map.addLayer({
          id,
          type: 'raster',
          source: id,
          layout: {
            visibility: 'visible',
          },
        });
      });
    }
    return () => {
      if (availableActiveMapOverlays) {
        availableActiveMapOverlays.forEach((mapOverlay) => {
          if (map.getLayer(mapOverlay.id)) {
            map.removeLayer(mapOverlay.id);
          }
          if (map.getSource(mapOverlay.id)) {
            map.removeSource(mapOverlay.id);
          }
        });
      }
    };
  }, [id, availableActiveMapOverlays]);

  return null;
};

export default MapOverlay;
