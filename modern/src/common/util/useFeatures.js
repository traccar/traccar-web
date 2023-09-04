import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const get = (server, user, key) => {
  if (server && user) {
    if (user.administrator) {
      return false;
    }
    if (server.forceSettings) {
      return server.attributes[key] || user.attributes[key] || false;
    }
    return user.attributes[key] || server.attributes[key] || false;
  }
  return false;
};

const featureSelector = createSelector(
  (state) => state.session.server,
  (state) => state.session.user,
  (server, user) => {
    const disableAttributes = get(server, user, 'ui.disableAttributes');
    const disableVehicleFetures = get(server, user, 'ui.disableVehicleFetures');
    const disableDrivers = disableVehicleFetures || get(server, user, 'ui.disableDrivers');
    const disableMaintenance = disableVehicleFetures || get(server, user, 'ui.disableMaintenance');
    const disableGroups = get(server, user, 'ui.disableGroups');
    const disableEvents = get(server, user, 'ui.disableEvents');
    const disableComputedAttributes = get(server, user, 'ui.disableComputedAttributes');
    const disableCalendars = get(server, user, 'ui.disableCalendars');

    return {
      disableAttributes,
      disableDrivers,
      disableMaintenance,
      disableGroups,
      disableEvents,
      disableComputedAttributes,
      disableCalendars,
    };
  },
);

export default () => useSelector(featureSelector);
