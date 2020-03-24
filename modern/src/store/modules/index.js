import { combineReducers } from '@reduxjs/toolkit';

import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';

export const rootReducer = combineReducers({
  devices,
  positions,
});

export { devicesActions } from './devices';
export { positionsActions } from './positions';
