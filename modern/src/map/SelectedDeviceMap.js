import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import dimensions from '../theme/dimensions';
import { map } from './Map';

const SelectedDeviceMap = () => {
  const mapCenter = useSelector((state) => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return { deviceId: state.devices.selectedId, position: [position.longitude, position.latitude] };
      }
    }
    return null;
  });

  useEffect(() => {
    if (mapCenter) {
      map.easeTo({
        center: mapCenter.position,
        offset: [0, -dimensions.popupMapOffset / 2],
      });
    }
  }, [mapCenter]);

  return null;
};

export default SelectedDeviceMap;
