import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { errorsReducer as errors } from './errors';
import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { eventsReducer as events } from './events';
import { geofencesReducer as geofences } from './geofences';
import { groupsReducer as groups } from './groups';
import { driversReducer as drivers } from './drivers';
import { maintenancesReducer as maintenances } from './maintenances';
import { calendarsReducer as calendars } from './calendars';
import { reportsReducer as reports } from './reports';
import { mobileGroupsReducer as mobileGroups } from './mobile-groups';
import { dictionariesReducer as dictionaries } from './dictionaries';
import throttleMiddleware from './throttleMiddleware';
import mobileGroupApi from '../services/mobile-group';
import dictionariesApi from '../services/dictionaries';

const reducer = combineReducers({
  errors,
  session,
  devices,
  events,
  geofences,
  groups,
  drivers,
  maintenances,
  calendars,
  reports,
  mobileGroups,
  dictionaries,
  [mobileGroupApi.reducerPath]: [mobileGroupApi.reducer],
  [dictionariesApi.reducerPath]: [dictionariesApi.reducer],
});

export { errorsActions } from './errors';
export { sessionActions } from './session';
export { devicesActions } from './devices';
export { eventsActions } from './events';
export { geofencesActions } from './geofences';
export { groupsActions } from './groups';
export { driversActions } from './drivers';
export { maintenancesActions } from './maintenances';
export { calendarsActions } from './calendars';
export { reportsActions } from './reports';

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(throttleMiddleware, mobileGroupApi.middleware, dictionariesApi.middleware),
});
