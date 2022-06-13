import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectAsync } from '../../reactHelper';
import { sessionActions } from '../../store';

export const nativePostMessage = (message) => {
  if (window.webkit && window.webkit.messageHandlers.appInterface) {
    window.webkit.messageHandlers.appInterface.postMessage(message);
  }
  if (window.appInterface) {
    window.appInterface.postMessage(message);
  }
};

const listeners = new Set();
window.updateNotificationToken = (token) => {
  listeners.forEach((listener) => listener(token));
};

const NativeInterface = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const listener = (token) => setToken(token);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, [setToken]);

  useEffectAsync(async () => {
    if (user && token) {
      setToken(null);

      const tokens = user.attributes.notificationTokens?.split(',') || [];
      const updatedUser = {
        ...user,
        attributes: {
          ...user.attributes,
          notificationTokens: [...tokens, token].join(','),
        },
      };

      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        dispatch(sessionActions.updateUser(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [user, token, setToken]);

  return null;
};

export default NativeInterface;
