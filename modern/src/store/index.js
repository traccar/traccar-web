import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';
import { geofencesReducer as geofences } from './geofences';
import { groupsReducer as groups } from './groups';
import { driversReducer as drivers } from './drivers';
import { maintenancesReducer as maintenances } from './maintenances';

const reducer = combineReducers({
  session,
  devices,
  positions,
  geofences,
  groups,
  drivers,
  maintenances,
});

export { sessionActions } from './session';
export { devicesActions } from './devices';
export { positionsActions } from './positions';
export { geofencesActions } from './geofences';
export { groupsActions } from './groups';
export { driversActions } from './drivers';
export { maintenancesActions } from './maintenances';

export default configureStore({ reducer });
