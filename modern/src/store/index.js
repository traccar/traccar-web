import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';
import { geofencesReducer as geofences } from './geofences';

const reducer = combineReducers({
  session,
  devices,
  positions,
  geofences,
});

export { sessionActions } from './session';
export { devicesActions } from './devices';
export { positionsActions } from './positions';
export { geofencesActions } from './geofences';

export default configureStore({ reducer });
