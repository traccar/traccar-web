import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import {
  altitudeFromMeters,
  altitudeUnitString,
  distanceFromMeters,
  distanceUnitString,
  speedFromKnots,
  speedUnitString,
  volumeFromLiters,
  volumeUnitString,
} from './converter';
import { prefixString } from './stringUtils';

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const formatBoolean = (value, t) => (value ? t('sharedYes') : t('sharedNo'));

export const formatNumber = (value, precision = 1) => Number(value.toFixed(precision));

export const formatPercentage = (value) => `${value}%`;

export const formatTemperature = (value) => `${value.toFixed(1)}°C`;

export const formatVoltage = (value, t) => `${value.toFixed(2)} ${t('sharedVoltAbbreviation')}`;

export const formatConsumption = (value, t) => `${value.toFixed(2)} ${t('sharedLiterPerHourAbbreviation')}`;

export const formatTime = (value, format) => {
  if (value) {
    const d = dayjs(value).toDate();
    const dateConfig = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const minuteConfig = { hour: '2-digit', minute: '2-digit' };
    const secondConfig = { ...minuteConfig, second: '2-digit' };
    switch (format) {
      case 'date':
        return d.toLocaleDateString(undefined, dateConfig);
      case 'time':
        return d.toLocaleTimeString(undefined, secondConfig);
      case 'minutes':
        return d.toLocaleString(undefined, { ...dateConfig, ...minuteConfig });
      default:
        return d.toLocaleString(undefined, { ...dateConfig, ...secondConfig });
    }
  }
  return '';
};

export const formatStatus = (value, t) => t(prefixString('deviceStatus', value));

export const formatAlarm = (value, t) => {
  if (value) {
    return value.split(',')
      .map((alarm) => t(prefixString('alarm', alarm)))
      .join(', ');
  }
  return '';
};

export const formatCourse = (value) => {
  const courseValues = ['\u2191', '\u2197', '\u2192', '\u2198', '\u2193', '\u2199', '\u2190', '\u2196'];
  let normalizedValue = (value + 45 / 2) % 360;
  if (normalizedValue < 0) {
    normalizedValue += 360;
  }
  return courseValues[Math.floor(normalizedValue / 45)];
};

export const formatDistance = (value, unit, t) => `${distanceFromMeters(value, unit).toFixed(2)} ${distanceUnitString(unit, t)}`;

export const formatAltitude = (value, unit, t) => `${altitudeFromMeters(value, unit).toFixed(2)} ${altitudeUnitString(unit, t)}`;

export const formatSpeed = (value, unit, t) => `${speedFromKnots(value, unit).toFixed(2)} ${speedUnitString(unit, t)}`;

export const formatVolume = (value, unit, t) => `${volumeFromLiters(value, unit).toFixed(2)} ${volumeUnitString(unit, t)}`;

export const formatNumericHours = (value, t) => {
  const hours = Math.floor(value / 3600000);
  const minutes = Math.floor((value % 3600000) / 60000);
  return `${hours} ${t('sharedHourAbbreviation')} ${minutes} ${t('sharedMinuteAbbreviation')}`;
};

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
      return 'success';
    case 'offline':
      return 'error';
    case 'unknown':
    default:
      return 'neutral';
  }
};

export const getBatteryStatus = (batteryLevel) => {
  if (batteryLevel >= 70) {
    return 'success';
  }
  if (batteryLevel > 30) {
    return 'warning';
  }
  return 'error';
};

export const formatNotificationTitle = (t, notification, includeId) => {
  let title = t(prefixString('event', notification.type));
  if (notification.type === 'alarm') {
    const alarmString = notification.attributes.alarms;
    if (alarmString) {
      const alarms = alarmString.split(',');
      if (alarms.length > 1) {
        title += ` (${alarms.length})`;
      } else {
        title += ` ${formatAlarm(alarms[0], t)}`;
      }
    }
  }
  if (includeId) {
    title += ` [${notification.id}]`;
  }
  return title;
};
