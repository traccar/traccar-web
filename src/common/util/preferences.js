import { useSelector } from 'react-redux';

const containsProperty = (object, key) => object.hasOwnProperty(key) && object[key] !== null;

export const usePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    if (containsProperty(state.session.server, key)) {
      return state.session.server[key];
    }
    if (containsProperty(state.session.user, key)) {
      return state.session.user[key];
    }
    return defaultValue;
  }
  if (containsProperty(state.session.user, key)) {
    return state.session.user[key];
  }
  if (containsProperty(state.session.server, key)) {
    return state.session.server[key];
  }
  return defaultValue;
});

export const useAttributePreference = (key, defaultValue) => useSelector((state) => {
  if (state.session.server.forceSettings) {
    if (containsProperty(state.session.server.attributes, key)) {
      return state.session.server.attributes[key];
    }
    if (containsProperty(state.session.user.attributes, key)) {
      return state.session.user.attributes[key];
    }
    return defaultValue;
  }
  if (containsProperty(state.session.user.attributes, key)) {
    return state.session.user.attributes[key];
  }
  if (containsProperty(state.session.server.attributes, key)) {
    return state.session.server.attributes[key];
  }
  return defaultValue;
});
