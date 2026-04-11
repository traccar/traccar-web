import { useMemo } from 'react';

export default (t) =>
  useMemo(
    () => ({
      speedLimit: {
        name: t('attributeSpeedLimit'),
        type: 'number',
        subtype: 'speed',
      },
      fuelDropThreshold: {
        name: t('attributeFuelDropThreshold'),
        type: 'number',
      },
      fuelIncreaseThreshold: {
        name: t('attributeFuelIncreaseThreshold'),
        type: 'number',
      },
      'report.ignoreOdometer': {
        name: t('attributeReportIgnoreOdometer'),
        type: 'boolean',
      },
      deviceInactivityStart: {
        name: t('attributeDeviceInactivityStart'),
        type: 'number',
      },
      deviceInactivityPeriod: {
        name: t('attributeDeviceInactivityPeriod'),
        type: 'number',
      },
      notificationTokens: {
        name: t('attributeNotificationTokens'),
        type: 'string',
      },
      'filter.invalid': {
        name: t('attributeFilterInvalid'),
        type: 'boolean',
      },
      'filter.zero': {
        name: t('attributeFilterZero'),
        type: 'boolean',
      },
      'filter.duplicate': {
        name: t('attributeFilterDuplicate'),
        type: 'boolean',
      },
      'filter.outdated': {
        name: t('attributeFilterOutdated'),
        type: 'boolean',
      },
      'filter.future': {
        name: t('attributeFilterFuture'),
        type: 'number',
      },
      'filter.past': {
        name: t('attributeFilterPast'),
        type: 'number',
      },
      'filter.accuracy': {
        name: t('attributeFilterAccuracy'),
        type: 'number',
      },
      'filter.approximate': {
        name: t('attributeFilterApproximate'),
        type: 'boolean',
      },
      'filter.static': {
        name: t('attributeFilterStatic'),
        type: 'boolean',
      },
      'filter.distance': {
        name: t('attributeFilterDistance'),
        type: 'number',
      },
      'filter.maxSpeed': {
        name: t('attributeFilterMaxSpeed'),
        type: 'number',
      },
      'filter.minPeriod': {
        name: t('attributeFilterMinPeriod'),
        type: 'number',
      },
      'filter.dailyLimit': {
        name: t('attributeFilterDailyLimit'),
        type: 'number',
      },
      'filter.dailyLimitInterval': {
        name: t('attributeFilterDailyLimitInterval'),
        type: 'number',
      },
      'filter.skipLimit': {
        name: t('attributeFilterSkipLimit'),
        type: 'number',
      },
      'filter.skipAttributes.enable': {
        name: t('attributeFilterSkipAttributesEnable'),
        type: 'boolean',
      },
      'filter.skipAttributes': {
        name: t('attributeFilterSkipAttributes'),
        type: 'string',
      },
    }),
    [t],
  );
