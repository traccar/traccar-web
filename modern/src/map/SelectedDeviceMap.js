import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import dimensions from '../theme/dimensions';
import { map } from './Map';
import { usePrevious } from '../reactHelper';
import usePersistedState from '../common/usePersistedState';

const SelectedDeviceMap = () => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const previousDeviceId = usePrevious(selectedDeviceId);

  const position = useSelector((state) => state.positions.items[selectedDeviceId]);

  const [mapFollow] = usePersistedState('mapFollow', false);

  useEffect(() => {
    if ((selectedDeviceId !== previousDeviceId || mapFollow) && position) {
      map.easeTo({
        center: [position.longitude, position.latitude],
        zoom: Math.max(map.getZoom(), 10),
        offset: [0, -dimensions.popupMapOffset / 2],
      });
    }
  });

  return null;
};

export default SelectedDeviceMap;
