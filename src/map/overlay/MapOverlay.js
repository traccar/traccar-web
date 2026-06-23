import { useId, useEffect, useMemo } from 'react';
import { useAttributePreference } from '../../common/util/preferences';
import { map } from '../core/MapView';
import useMapOverlays from './useMapOverlays';

const MapOverlay = () => {
  const id = useId();

  const mapOverlays = useMapOverlays();
  const selectedMapOverlay = useAttributePreference('selectedMapOverlay');

  const activeOverlays = useMemo(() => {
    const selectedIds = selectedMapOverlay ? selectedMapOverlay.split(',') : [];
    return mapOverlays
      .filter((overlay) => overlay.available)
      .filter((overlay) => selectedIds.includes(overlay.id));
  }, [mapOverlays, selectedMapOverlay]);

  useEffect(() => {
    const layerIds = activeOverlays.map((overlay, index) => `${id}-${index}`);
    activeOverlays.forEach((overlay, index) => {
      const layerId = layerIds[index];
      map.addSource(layerId, overlay.source);
      map.addLayer({
        id: layerId,
        type: 'raster',
        source: layerId,
        metadata: { 'traccar:title': overlay.title },
        layout: {
          visibility: 'visible',
        },
      });
    });
    return () => {
      layerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.removeLayer(layerId);
        }
        if (map.getSource(layerId)) {
          map.removeSource(layerId);
        }
      });
    };
  }, [id, activeOverlays]);

  return null;
};

export default MapOverlay;
