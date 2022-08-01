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
  'ui.disableGroups': {
    name: t('attributeUiDisableGroups'),
    type: 'boolean',
  },
  'ui.disableAttributes': {
    name: t('attributeUiDisableAttributes'),
    type: 'boolean',
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
  'web.liveRouteLength': {
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
  iconScale: {
    name: t('sharedIconScale'),
    type: 'number',
  },
}), [t]);
