import { useSelector } from 'react-redux';

const get = (server, user, key) => {
  if (server && user) {
    if (server.forceSettings) {
      return server.attributes[key] || user.attributes[key] || false;
    }
    return user.attributes[key] || server.attributes[key] || false;
  }
  return false;
};

export default () => useSelector((state) => {
  const { server, user } = state.session;

  const disableVehicleFetures = get(server, user, 'ui.disableVehicleFetures');
  const disableDrivers = disableVehicleFetures || get(server, user, 'ui.disableDrivers');
  const disableMaintenance = disableVehicleFetures || get(server, user, 'ui.disableMaintenance');
  const disableEvents = get(server, user, 'ui.disableEvents');
  const disableComputedAttributes = get(server, user, 'ui.disableComputedAttributes');
  const disableCalendars = get(server, user, 'ui.disableCalendars');

  return {
    disableDrivers,
    disableMaintenance,
    disableEvents,
    disableComputedAttributes,
    disableCalendars,
  };
});
