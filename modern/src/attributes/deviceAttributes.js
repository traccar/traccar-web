import { useMemo } from 'react';

export const useDeviceAttributes = (t) => useMemo({
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'string',
  },
  'report.ignoreOdometer': {
    name: t('attributeReportIgnoreOdometer'),
    type: 'boolean',
  },
}, [t]);
