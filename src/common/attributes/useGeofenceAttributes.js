import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  color: {
    name: t('attributeColor'),
    type: 'string',
    subtype: 'color',
  },
  mapLineWidth: {
    name: t('attributeMapLineWidth'),
    type: 'number',
  },
  mapLineOpacity: {
    name: t('attributeMapLineOpacity'),
    type: 'number',
  },
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'number',
    subtype: 'speed',
  },
  polylineDistance: {
    name: t('attributePolylineDistance'),
    type: 'number',
    subtype: 'distance',
  },
  hide: {
    name: t('sharedFilterMap'),
    type: 'boolean',
  },
}), [t]);
