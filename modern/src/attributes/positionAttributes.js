import { useMemo } from 'react';

export const usePositionAttributes = (t) => useMemo({
  raw: {
    name: t('positionRaw'),
    type: 'string',
  },
  index: {
    name: t('positionIndex'),
    type: 'number',
  },
  ignition: {
    name: t('positionIgnition'),
    type: 'boolean',
  },
  odometer: {
    name: t('positionOdometer'),
    type: 'number',
    dataType: 'distance',
  },
}, [t]);
