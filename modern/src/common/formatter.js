import moment from 'moment';
import t from '../common/localization';

export const formatPosition = (value, key) => {
  if (value != null && typeof value === 'object') {
    value = value[key];
  }
  switch (key) {
    case 'fixTime':
    case 'deviceTime':
    case 'serverTime':
    case 'eventTime':
      return moment(value).format('LLL');
    case 'latitude':
    case 'longitude':
      return value.toFixed(5);
    case 'speed':
    case 'course':
      return value.toFixed(1);
    case 'batteryLevel':
      return value + '%';
    default:
      if (typeof value === 'number') {
        return formatNumber(value);
      } else if (typeof value === 'boolean') {
        return formatBoolean(value);
      } else {
        return value;
      }
  }
};

export const formatBoolean = (value) => {
  return value ? t('sharedYes') : t('sharedNo');
};

export const formatNumber = (value, precision = 1) => {
  return Number(value.toFixed(precision));
};

export const formatDate = (value, format = 'YYYY-MM-DD HH:mm') => {
  return moment(value).format(format);
};

export const formatDistance = (value, unit) => {
  switch (unit) {
    case 'mi':
      return `${(value * 0.000621371).toFixed(2)} ${t('sharedMi')}`;
    case 'nmi':
      return `${(value * 0.000539957).toFixed(2)} ${t('sharedNmi')}`;
    case 'km':
    default:
        return `${(value * 0.001).toFixed(2)} ${t('sharedKm')}`;
  }
};

export const formatSpeed = (value, unit) => {
  switch (unit) {
    case 'kmh':
      return `${(value * 1.852).toFixed(2)} ${t('sharedKmh')}`;
    case 'mph':
      return `${(value * 1.15078).toFixed(2)} ${t('sharedMph')}`;
    case 'kn':
    default:
        return `${(value * 1).toFixed(2)} ${t('sharedKn')}`;
  }  
};

export const formatVolume = (value, unit) => {
  switch (unit) {
    case 'impGal':
      return `${(value / 4.546).toFixed(2)} ${t('sharedGallonAbbreviation')}`;
    case 'usGal':
      return `${(value / 3.785).toFixed(2)} ${t('sharedGallonAbbreviation')}`;
    case 'ltr':
    default:
        return `${(value / 1).toFixed(2)} ${t('sharedLiterAbbreviation')}`;
  }  
}

export const formatHours = (value) => {
  return moment.duration(value).humanize();
};

export const formatCoordinate = (key, value, unit) => {
  var hemisphere, degrees, minutes, seconds;
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
      return degrees + '° ' + minutes.toFixed(6) + '\' ' + hemisphere;
    case 'dms':
      value = Math.abs(value);
      degrees = Math.floor(value);
      minutes = Math.floor((value - degrees) * 60);
      seconds = Math.round((value - degrees - minutes / 60) * 3600);
      return degrees + '° ' + minutes + '\' ' + seconds + '" ' + hemisphere;
    default:
      return value.toFixed(6) + '°';
  }  
};
