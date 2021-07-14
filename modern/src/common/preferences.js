import { useSelector } from 'react-redux';

export const usePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    return state.session.server[key] || state.session.user[key] || defaultValue;
  }
  return state.session.user[key] || state.session.server[key] || defaultValue;
});

export const useAttributePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    return state.session.server.attributes[key] || state.session.user.attributes[key] || defaultValue;
  }
  return state.session.user.attributes[key] || state.session.server.attributes[key] || defaultValue;
});
