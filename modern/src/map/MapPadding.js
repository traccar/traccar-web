import { useEffect } from 'react';

import { map } from './core/MapView';

const MapPadding = ({
  top, right, bottom, left,
}) => {
  useEffect(() => {
    map.setPadding({
      top, right, bottom, left,
    });
    return () => map.setPadding({
      top: 0, right: 0, bottom: 0, left: 0,
    });
  }, [top, right, bottom, left]);

  return null;
};

export default MapPadding;
