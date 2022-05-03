import React, { useEffect, useState } from 'react';
import { Link } from '@material-ui/core';
import {
  formatAlarm, formatBoolean, formatCoordinate, formatCourse, formatDistance, formatNumber, formatPercentage, formatSpeed, formatTime,
} from '../common/formatter';
import { useAttributePreference, usePreference } from '../common/preferences';
import { useTranslation } from '../LocalizationProvider';

const PositionValue = ({ position, property, attribute }) => {
  const t = useTranslation();

  const key = property || attribute;
  const value = property ? position[property] : position.attributes[attribute];

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const coordinateFormat = usePreference('coordinateFormat');

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(position.address);
  }, [position]);

  const showAddress = async () => {
    const query = new URLSearchParams({
      latitude: position.latitude,
      longitude: position.longitude,
    });
    const response = await fetch(`/api/server/geocode?${query.toString()}`);
    if (response.ok) {
      setAddress(await response.text());
    }
  };

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
        return formatDistance(value, distanceUnit, t);
      default:
        if (typeof value === 'number') {
          return formatNumber(value);
        } if (typeof value === 'boolean') {
          return formatBoolean(value, t);
        }
        return value;
    }
  };

  if (property === 'address') {
    if (address) {
      return (<>{address}</>);
    }
    return (<Link onClick={showAddress}>{t('sharedShowAddress')}</Link>);
  }
  return (<>{formatValue(value)}</>);
};

export default PositionValue;
