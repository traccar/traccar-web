import { useMemo } from 'react';
import { useAttributePreference } from '../../common/util/preferences';
import useMapLayer from '../core/useMapLayer';
import useMapOverlays from './useMapOverlays';

const MapOverlayLayer = ({ overlay }) => {
  useMapLayer({
    source: overlay.source,
    layers: [
      {
        type: 'raster',
        metadata: { 'traccar:title': overlay.title },
        layout: {
          visibility: 'visible',
        },
      },
    ],
    layersDeps: [overlay],
  });

  return null;
};

const MapOverlay = () => {
  const mapOverlays = useMapOverlays();
  const selectedMapOverlay = useAttributePreference('selectedMapOverlay');

  const activeOverlays = useMemo(() => {
    const selectedIds = selectedMapOverlay ? selectedMapOverlay.split(',') : [];
    return mapOverlays
      .filter((overlay) => overlay.available)
      .filter((overlay) => selectedIds.includes(overlay.id));
  }, [mapOverlays, selectedMapOverlay]);

  return activeOverlays.map((overlay) => <MapOverlayLayer key={overlay.id} overlay={overlay} />);
};

export default MapOverlay;
