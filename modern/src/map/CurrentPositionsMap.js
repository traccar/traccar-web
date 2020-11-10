import React, {  } from 'react';
import { useSelector } from 'react-redux';

import PositionsMap from './PositionsMap';

const CurrentPositionsMap = () => {
  const positions = useSelector(state => Object.values(state.positions.items));
  return (<PositionsMap positions={positions} />);
}

export default CurrentPositionsMap;
