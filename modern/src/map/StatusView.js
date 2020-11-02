import t from '../common/localization'
import React from 'react';
import { useSelector } from 'react-redux';
import { formatPosition } from '../common/formatter';

const StatusView = ({ deviceId, onShowDetails }) => {
  const device = useSelector(state => state.devices.items[deviceId]);
  const position = useSelector(state => state.positions.items[deviceId]);

  const handleClick = e => {
    e.preventDefault();
    onShowDetails(position.id);
  };

  return (
    <>
      <b>{t('deviceStatus')}:</b> {formatPosition(device.status, 'status')}<br />
      <b>{t('sharedLocation')}:</b> {formatPosition(position, 'latitude')} {formatPosition(position, 'longitude')}<br />
      <b>{t('positionSpeed')}:</b> {formatPosition(position.speed, 'speed')}<br />
      <b>{t('positionCourse')}:</b> {formatPosition(position.course, 'course')}<br />
      <b>{t('positionDistance')}:</b> {formatPosition(position.attributes.totalDistance, 'distance')}<br />
      {position.attributes.batteryLevel &&
        <><b>{t('positionBattery')}:</b> {formatPosition(position.attributes.batteryLevel, 'batteryLevel')}<br /></>
      }
      <a href="/" onClick={handleClick}>{t('sharedShowDetails')}</a>
    </>
  );
};

export default StatusView;
