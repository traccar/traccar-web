import { useEffect, useRef, useState } from 'react';

const listeners = new Map();

const broadcast = (key, value) => {
  listeners.get(key)?.forEach((listener) => listener(value));
};

export const savePersistedState = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
  broadcast(key, value);
};

export default (key, defaultValue) => {
  const defaultRef = useRef(defaultValue);

  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue ? JSON.parse(stickyValue) : defaultRef.current;
  });

  useEffect(() => {
    if (!listeners.has(key)) {
      listeners.set(key, new Set());
    }
    listeners.get(key).add(setValue);
    return () => listeners.get(key).delete(setValue);
  }, [key]);

  useEffect(() => {
    if (value !== defaultRef.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      window.localStorage.removeItem(key);
    }
    broadcast(key, value);
  }, [key, value]);

  return [value, setValue];
};
