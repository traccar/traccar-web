import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { map } from './Map';

const SelectedDeviceMap = () => {
  const mapCenter = useSelector(state => {
    if (state.devices.selectedId) {
      const position = state.positions.items[state.devices.selectedId] || null;
      if (position) {
        return [position.longitude, position.latitude];
      }
    }
    return null;
  });

  useEffect(() => {
    map.easeTo({ center: mapCenter });
  }, [mapCenter]);

  return null;
}

export default SelectedDeviceMap;
