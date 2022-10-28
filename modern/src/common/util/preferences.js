import { useSelector } from 'react-redux';

export const usePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    if (state.session.server.hasOwnProperty(key)) {
      return state.session.server[key];
    }
    if (state.session.user.hasOwnProperty(key)) {
      return state.session.user[key];
    }
    return defaultValue;
  }
  if (state.session.user.hasOwnProperty(key)) {
    return state.session.user[key];
  }
  if (state.session.server.hasOwnProperty(key)) {
    return state.session.server[key];
  }
  return defaultValue;
});

export const useAttributePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    if (state.session.server.attributes.hasOwnProperty(key)) {
      return state.session.server.attributes[key];
    }
    if (state.session.user.attributes.hasOwnProperty(key)) {
      return state.session.user.attributes[key];
    }
    return defaultValue;
  }
  if (state.session.user.attributes.hasOwnProperty(key)) {
    return state.session.user.attributes[key];
  }
  if (state.session.server.attributes.hasOwnProperty(key)) {
    return state.session.server.attributes[key];
  }
  return defaultValue;
});
