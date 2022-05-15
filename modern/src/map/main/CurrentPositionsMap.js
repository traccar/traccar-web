import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { devicesActions } from '../../store';
import PositionsMap from '../PositionsMap';

const CurrentPositionsMap = () => {
  const dispatch = useDispatch();

  const onClick = useCallback((_, deviceId) => {
    dispatch(devicesActions.select(deviceId));
  }, [dispatch]);

  const positions = useSelector((state) => state.positions.items);
  return (<PositionsMap positions={Object.values(positions)} onClick={onClick} />);
};

export default CurrentPositionsMap;
