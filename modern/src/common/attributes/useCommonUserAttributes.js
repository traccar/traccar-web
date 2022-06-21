import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  locationIqKey: {
    name: t('mapLocationIqKey'),
    type: 'string',
  },
  mapboxAccessToken: {
    name: t('mapMapboxKey'),
    type: 'string',
  },
  mapTilerKey: {
    name: t('mapMapTilerKey'),
    type: 'string',
  },
  bingMapsKey: {
    name: t('mapBingKey'),
    type: 'string',
  },
  openWeatherKey: {
    name: t('mapOpenWeatherKey'),
    type: 'string',
  },
  tomTomKey: {
    name: t('mapTomTomKey'),
    type: 'string',
  },
  hereKey: {
    name: t('mapHereKey'),
    type: 'string',
  },
  notificationTokens: {
    name: t('attributeNotificationTokens'),
    type: 'string',
  },
  'ui.disableEvents': {
    name: t('attributeUiDisableEvents'),
    type: 'boolean',
  },
  'ui.disableVehicleFetures': {
    name: t('attributeUiDisableVehicleFetures'),
    type: 'boolean',
  },
  'ui.disableDrivers': {
    name: t('attributeUiDisableDrivers'),
    type: 'boolean',
  },
  'ui.disableComputedAttributes': {
    name: t('attributeUiDisableComputedAttributes'),
    type: 'boolean',
  },
  'ui.disableCalendars': {
    name: t('attributeUiDisableCalendars'),
    type: 'boolean',
  },
  'ui.disableMaintenance': {
    name: t('attributeUiDisableMaintenance'),
    type: 'boolean',
  },
  'ui.disableLocationIq': {
    name: t('attributeUiDisableLocationIq'),
    type: 'boolean',
  },
  'ui.disableOsm': {
    name: t('attributeUiDisabledOsm'),
    type: 'boolean',
  },
  'ui.disableCarto': {
    name: t('attributeUiDisabledCarto'),
    type: 'boolean',
  },
  'ui.disableMaptiler': {
    name: t('attributeUiDisabledMaptiler'),
    type: 'boolean',
  },
  'ui.disableBing': {
    name: t('attributeUiDisabledBing'),
    type: 'boolean',
  },
  'ui.disableTomtom': {
    name: t('attributeUiDisabledTomtom'),
    type: 'boolean',
  },
  'ui.disableHere': {
    name: t('attributeUiDisabledHere'),
    type: 'boolean',
  },
  'ui.disableAutoNavi': {
    name: t('attributeUiDisabledautoNavi'),
    type: 'boolean',
  },
  'ui.disableMapbox': {
    name: t('attributeUiDisabledMapbox'),
    type: 'boolean',
  },
  /* 'web.liveRouteLength': {
    name: t('attributeWebLiveRouteLength'),
    type: 'number',
  },
  'web.selectZoom': {
    name: t('attributeWebSelectZoom'),
    type: 'number',
  },
  'web.maxZoom': {
    name: t('attributeWebMaxZoom'),
    type: 'number',
  },
  'ui.hidePositionAttributes': {
    name: t('attributeUiHidePositionAttributes'),
    type: 'string',
  }, */
}), [t]);
