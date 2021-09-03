import { useMemo } from 'react';

export const useGeofenceAttributes = (t) => useMemo({
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'string',
  },
}, [t]);
