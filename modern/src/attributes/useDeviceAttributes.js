import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  speedLimit: {
    name: t('attributeSpeedLimit'),
    type: 'string',
  },
  'report.ignoreOdometer': {
    name: t('attributeReportIgnoreOdometer'),
    type: 'boolean',
  },
}), [t]);
