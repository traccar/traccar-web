import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  language: {
    name: t('loginLanguage'),
    type: 'string',
  },
  mapGeofences: {
    name: t('attributeShowGeofences'),
    type: 'boolean',
  },
  mapLiveRoutes: {
    name: t('mapLiveRoutes'),
    type: 'string',
  },
  mapDirection: {
    name: t('mapDirection'),
    type: 'string',
  },
  mapFollow: {
    name: t('deviceFollow'),
    type: 'boolean',
  },
  mapCluster: {
    name: t('mapClustering'),
    type: 'boolean',
  },
  mapOnSelect: {
    name: t('mapOnSelect'),
    type: 'boolean',
  },
  activeMapStyles: {
    name: t('mapActive'),
    type: 'string',
  },
  devicePrimary: {
    name: t('devicePrimaryInfo'),
    type: 'string',
  },
  deviceSecondary: {
    name: t('deviceSecondaryInfo'),
    type: 'string',
  },
  soundEvents: {
    name: t('eventsSoundEvents'),
    type: 'string',
  },
  soundAlarms: {
    name: t('eventsSoundAlarms'),
    type: 'string',
  },
  positionItems: {
    name: t('attributePopupInfo'),
    type: 'string',
  },
  googleKey: {
    name: t('mapGoogleKey'),
    type: 'string',
  },
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
  'ui.disableSavedCommands': {
    name: t('attributeUiDisableSavedCommands'),
    type: 'boolean',
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
  'ui.disableVehicleFeatures': {
    name: t('attributeUiDisableVehicleFeatures'),
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
  mapLineWidth: {
    name: t('attributeMapLineWidth'),
    type: 'number',
  },
  mapLineOpacity: {
    name: t('attributeMapLineOpacity'),
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
  navigationAppLink: {
    name: t('attributeNavigationAppLink'),
    type: 'string',
  },
  navigationAppTitle: {
    name: t('attributeNavigationAppTitle'),
    type: 'string',
  },
}), [t]);
