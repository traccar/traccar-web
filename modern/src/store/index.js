import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';

const reducer = combineReducers({
  devices,
  positions,
});

export { devicesActions } from './devices';
export { positionsActions } from './positions';

export default configureStore({ reducer });
