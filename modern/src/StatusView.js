import t from './common/localization'
import React from 'react';
import { useSelector } from 'react-redux';
import formatter from './common/formatter';

const StatusView = (props) => {
  const device = useSelector(state => state.devices.items[props.deviceId]);
  const position = useSelector(state => state.positions.items[props.deviceId]);

  return (
    <>
      <b>{t('deviceStatus')}:</b> {formatter(device.status, 'status')}<br />
      <b>{t('positionSpeed')}:</b> {formatter(position.speed, 'speed')}<br />
      <b>{t('positionCourse')}:</b> {formatter(position.course, 'course')}<br />
      <b>{t('positionDistance')}:</b> {formatter(position.attributes.totalDistance, 'distance')}<br />
    </>
  );
};

export default StatusView;
