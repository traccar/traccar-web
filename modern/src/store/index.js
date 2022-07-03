import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { errorsReducer as errors } from './errors';
import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';
import { eventsReducer as events } from './events';
import { geofencesReducer as geofences } from './geofences';
import { groupsReducer as groups } from './groups';
import { driversReducer as drivers } from './drivers';
import { maintenancesReducer as maintenances } from './maintenances';
import throttleMiddleware from './throttleMiddleware';

const reducer = combineReducers({
  errors,
  session,
  devices,
  positions,
  events,
  geofences,
  groups,
  drivers,
  maintenances,
});

export { errorsActions } from './errors';
export { sessionActions } from './session';
export { devicesActions } from './devices';
export { positionsActions } from './positions';
export { eventsActions } from './events';
export { geofencesActions } from './geofences';
export { groupsActions } from './groups';
export { driversActions } from './drivers';
export { maintenancesActions } from './maintenances';

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(throttleMiddleware),
});
