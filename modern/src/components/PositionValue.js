import React from 'react';
import { formatAlarm, formatBoolean, formatCoordinate, formatCourse, formatDistance, formatNumber, formatPercentage, formatSpeed, formatTime } from '../common/formatter';
import { useAttributePreference, usePreference } from '../common/preferences';
import { useTranslation } from '../LocalizationProvider';

const PositionValue = ({ position, property, attribute }) => {
  const t = useTranslation();

  const key = property || attribute;
  const value = property ? position[property] : position.attributes[attribute];

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const coordinateFormat = usePreference('coordinateFormat');

  const formatValue = () => {
    switch (key) {
      case 'fixTime':
      case 'deviceTime':
      case 'serverTime':
        return formatTime(value);
      case 'latitude':
        return formatCoordinate('latitude', value, coordinateFormat);
      case 'longitude':
        return formatCoordinate('longitude', value, coordinateFormat);
      case 'speed':
        return formatSpeed(value, speedUnit, t);
      case 'course':
        return formatCourse(value);
      case 'batteryLevel':
        return formatPercentage(value);
      case 'alarm':
        return formatAlarm(value, t);
      case 'odometer':
      case 'distance':
      case 'totalDistance':
        return formatDistance(value, distanceUnit, t)
      default:
        if (typeof value === 'number') {
          return formatNumber(value);
        } if (typeof value === 'boolean') {
          return formatBoolean(value, t);
        }
        return value;
    }
  }

  return (<>{formatValue(value)}</>);
};

export default PositionValue;
