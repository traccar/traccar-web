import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { messagesReducer as messages } from './messages';
import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { eventsReducer as events } from './events';
import { motionReducer as motion } from './motion';
import { geofencesReducer as geofences } from './geofences';
import { groupsReducer as groups } from './groups';
import { driversReducer as drivers } from './drivers';
import { maintenancesReducer as maintenances } from './maintenances';
import { calendarsReducer as calendars } from './calendars';
import { reportsReducer as reports } from './reports';
import throttleMiddleware from './throttleMiddleware';

const reducer = combineReducers({
  messages,
  session,
  devices,
  events,
  motion,
  geofences,
  groups,
  drivers,
  maintenances,
  calendars,
  reports,
});

export { messagesActions } from './messages';
export { sessionActions } from './session';
export { devicesActions } from './devices';
export { eventsActions } from './events';
export { motionActions } from './motion';
export { geofencesActions } from './geofences';
export { groupsActions } from './groups';
export { driversActions } from './drivers';
export { maintenancesActions } from './maintenances';
export { calendarsActions } from './calendars';
export { reportsActions } from './reports';

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(throttleMiddleware),
});
