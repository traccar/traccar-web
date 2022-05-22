import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { devicesActions } from '../../store';
import MapPositions from '../MapPositions';

const MapCurrentPositions = () => {
  const dispatch = useDispatch();

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);

  const positions = useSelector((state) => state.positions.items);
  return (<MapPositions positions={Object.values(positions)} onClick={onClick} />);
};

export default MapCurrentPositions;
