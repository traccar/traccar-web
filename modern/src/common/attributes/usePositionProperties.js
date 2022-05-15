import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  id: {
    name: t('deviceIdentifier'),
    type: 'number',
  },
  latitude: {
    name: t('positionLatitude'),
    type: 'number',
  },
  longitude: {
    name: t('positionLongitude'),
    type: 'number',
  },
  speed: {
    name: t('positionSpeed'),
    type: 'number',
  },
  course: {
    name: t('positionCourse'),
    type: 'number',
  },
  altitude: {
    name: t('positionAltitude'),
    type: 'number',
  },
  accuracy: {
    name: t('positionAccuracy'),
    type: 'number',
  },
  valid: {
    name: t('positionValid'),
    type: 'boolean',
  },
  protocol: {
    name: t('positionProtocol'),
    type: 'string',
  },
  address: {
    name: t('positionAddress'),
    type: 'string',
  },
  deviceTime: {
    name: t('positionDeviceTime'),
    type: 'string',
  },
  fixTime: {
    name: t('positionFixTime'),
    type: 'string',
  },
  serverTime: {
    name: t('positionServerTime'),
    type: 'string',
  },
}), [t]);
