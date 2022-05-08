import moment from 'moment';
import {
  distanceFromMeters, distanceUnitString, speedFromKnots, speedUnitString, volumeFromLiters, volumeUnitString,
} from './converter';
import { prefixString } from './stringUtils';

export const formatBoolean = (value, t) => (value ? t('sharedYes') : t('sharedNo'));

export const formatNumber = (value, precision = 1) => Number(value.toFixed(precision));

export const formatPercentage = (value) => `${value}%`;

export const formatDate = (value, format = 'YYYY-MM-DD HH:mm') => moment(value).format(format);
export const formatTime = (value, format = 'YYYY-MM-DD HH:mm:ss') => moment(value).format(format);

export const formatStatus = (value, t) => t(prefixString('deviceStatus', value));
export const formatAlarm = (value, t) => t(prefixString('alarm', value));

export const formatCourse = (value) => {
  const courseValues = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return courseValues[Math.floor(value / 45)];
};

export const formatDistance = (value, unit, t) => `${distanceFromMeters(value, unit).toFixed(2)} ${distanceUnitString(unit, t)}`;

export const formatSpeed = (value, unit, t) => `${speedFromKnots(value, unit).toFixed(2)} ${speedUnitString(unit, t)}`;

export const formatVolume = (value, unit, t) => `${volumeFromLiters(value, unit).toFixed(2)} ${volumeUnitString(unit, t)}`;

export const formatHours = (value) => moment.duration(value).humanize();

export const formatCoordinate = (key, value, unit) => {
  let hemisphere;
  let degrees;
  let minutes;
  let seconds;

  if (key === 'latitude') {
    hemisphere = value >= 0 ? 'N' : 'S';
  } else {
    hemisphere = value >= 0 ? 'E' : 'W';
  }

  switch (unit) {
    case 'ddm':
      value = Math.abs(value);
      degrees = Math.floor(value);
      minutes = (value - degrees) * 60;
      return `${degrees}° ${minutes.toFixed(6)}' ${hemisphere}`;
    case 'dms':
      value = Math.abs(value);
      degrees = Math.floor(value);
      minutes = Math.floor((value - degrees) * 60);
      seconds = Math.round((value - degrees - minutes / 60) * 3600);
      return `${degrees}° ${minutes}' ${seconds}" ${hemisphere}`;
    default:
      return `${value.toFixed(6)}°`;
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'online':
      return 'positive';
    case 'offline':
      return 'negative';
    case 'unknown':
    default:
      return 'neutral';
  }
};

export const getBatteryStatus = (batteryLevel) => {
  if (batteryLevel >= 70) {
    return 'positive';
  }
  if (batteryLevel > 30) {
    return 'medium';
  }
  return 'negative';
};
