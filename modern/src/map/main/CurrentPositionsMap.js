import React, { } from 'react';
import { useSelector } from 'react-redux';

import PositionsMap from '../PositionsMap';

const CurrentPositionsMap = () => {
  const positions = useSelector((state) => state.positions.items);
  return (<PositionsMap positions={Object.values(positions)} />);
};

export default CurrentPositionsMap;
