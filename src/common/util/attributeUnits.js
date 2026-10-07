import {
  altitudeFromMeters,
  altitudeToMeters,
  altitudeUnitString,
  distanceFromMeters,
  distanceToMeters,
  distanceUnitString,
  speedFromKnots,
  speedToKnots,
  speedUnitString,
  volumeFromLiters,
  volumeToLiters,
  volumeUnitString,
} from './converter.js';

const types = {
  altitude: { from: altitudeFromMeters, to: altitudeToMeters, unit: altitudeUnitString },
  distance: { from: distanceFromMeters, to: distanceToMeters, unit: distanceUnitString },
  speed: { from: speedFromKnots, to: speedToKnots, unit: speedUnitString },
  volume: { from: volumeFromLiters, to: volumeToLiters, unit: volumeUnitString },
  hours: {
    from: (value) => value / 3600000,
    to: (value) => value * 3600000,
    unit: (_, t) => t('sharedHours'),
  },
  voltage: { unit: (_, t) => t('sharedVoltAbbreviation') },
  percentage: { unit: () => '%' },
};

export const attributeFromRaw = (value, dataType, units) =>
  value != null && types[dataType]?.from
    ? types[dataType].from(value, units[`${dataType}Unit`])
    : value;

export const attributeToRaw = (value, dataType, units) =>
  value != null && types[dataType]?.to
    ? types[dataType].to(value, units[`${dataType}Unit`])
    : value;

export const attributeUnitString = (dataType, units, t) =>
  types[dataType]?.unit?.(units[`${dataType}Unit`], t);

export const formatAttributeNumber = (value, dataType, units) => {
  const converted = attributeFromRaw(value, dataType, units);
  return converted != null && types[dataType]?.from && dataType !== 'hours'
    ? converted.toFixed(2)
    : converted;
};
