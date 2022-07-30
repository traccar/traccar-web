import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import dimensions from '../../common/theme/dimensions';
import { map } from '../core/MapView';
import { usePrevious } from '../../reactHelper';
import usePersistedState from '../../common/util/usePersistedState';
import { useAttributePreference } from '../../common/util/preferences';

const MapSelectedDevice = () => {
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const previousDeviceId = usePrevious(selectedDeviceId);

  const selectZoom = useAttributePreference('web.selectZoom', 10);

  const position = useSelector((state) => state.positions.items[selectedDeviceId]);

  const [mapFollow] = usePersistedState('mapFollow', false);

  useEffect(() => {
    if ((selectedDeviceId !== previousDeviceId || mapFollow) && position) {
      map.easeTo({
        center: [position.longitude, position.latitude],
        zoom: Math.max(map.getZoom(), selectZoom),
        offset: [0, -dimensions.popupMapOffset / 2],
      });
    }
  });

  return null;
};

export default MapSelectedDevice;
