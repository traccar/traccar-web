import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  formatAlarm, formatAltitude, formatBoolean, formatCoordinate, formatCourse, formatDistance, formatNumber, formatNumericHours, formatPercentage, formatSpeed, formatTime, formatTemperature, formatVolume,
} from '../util/formatter';
import { useAttributePreference, usePreference } from '../util/preferences';
import { useTranslation } from './LocalizationProvider';
import { useAdministrator } from '../util/permissions';
import AddressValue from './AddressValue';
import GeofencesValue from './GeofencesValue';

const PositionValue = ({ position, property, attribute }) => {
  const t = useTranslation();

  const admin = useAdministrator();

  const device = useSelector((state) => state.devices.items[position.deviceId]);

  const key = property || attribute;
  const value = property ? position[property] : position.attributes[attribute];

  const distanceUnit = useAttributePreference('distanceUnit');
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const coordinateFormat = usePreference('coordinateFormat');
  const hours12 = usePreference('twelveHourFormat');
  const volumeUnitstring = usePreference('volumeUnit');

  const formatValue = () => {
    switch (key) {
      case 'fixTime':
      case 'deviceTime':
      case 'serverTime':
        return formatTime(value, 'seconds', hours12);
      case 'latitude':
        return formatCoordinate('latitude', value, coordinateFormat);
      case 'longitude':
        return formatCoordinate('longitude', value, coordinateFormat);
      case 'speed':
        return formatSpeed(value, speedUnit, t);
      case 'course':
        return formatCourse(value);
      case 'altitude':
        return formatAltitude(value, altitudeUnit, t);
      case 'batteryLevel':
        return value != null ? formatPercentage(value, t) : '';
      case 'coolantTemp':
        return formatTemperature(value);
      case 'alarm':
        return formatAlarm(value, t);
      case 'odometer':
      case 'distance':
      case 'totalDistance':
        return value != null ? formatDistance(value, distanceUnit, t) : '';
      case 'hours':
        return value != null ? formatNumericHours(value, t) : '';
      case 'fuel':
        return formatVolume(value, volumeUnitstring, t);
      default:
        if (typeof value === 'number') {
          return formatNumber(value);
        } if (typeof value === 'boolean') {
          return formatBoolean(value, t);
        }
        return value || '';
    }
  };

  switch (key) {
    case 'image':
    case 'video':
    case 'audio':
      return (<Link href={`/api/media/${device.uniqueId}/${value}`} target="_blank">{value}</Link>);
    case 'totalDistance':
    case 'hours':
      return (
        <>
          {formatValue(value)}
          &nbsp;&nbsp;
          {admin && (<Link component={RouterLink} underline="none" to={`/settings/accumulators/${position.deviceId}`}>&#9881;</Link>)}
        </>
      );
    case 'address':
      return (<AddressValue latitude={position.latitude} longitude={position.longitude} originalAddress={value} />);
    case 'network':
      if (value) {
        return (<Link component={RouterLink} underline="none" to={`/network/${position.id}`}>{t('sharedInfoTitle')}</Link>);
      }
      return '';
    case 'geofenceIds':
      if (value) {
        return (<GeofencesValue geofenceIds={value} />);
      }
      return '';
    default:
      return formatValue(value);
  }
};

export default PositionValue;
