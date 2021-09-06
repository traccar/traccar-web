import { useRef } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { positionsActions, devicesActions, sessionActions } from './store';
import { useEffectAsync } from './reactHelper';

const displayNotifications = (events) => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      events.forEach((event) => {
        const notification = new Notification(`Event: ${event.type}`);
        setTimeout(notification.close.bind(notification), 4 * 1000);
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          displayNotifications(events);
        }
      });
    }
  }
};

const SocketController = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const authenticated = useSelector((state) => !!state.session.user);

  const socketRef = useRef();

  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}/api/socket`);
    socketRef.current = socket;

    socket.onerror = () => {
      setTimeout(() => connectSocket(), 60 * 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        dispatch(devicesActions.update(data.devices));
      }
      if (data.positions) {
        dispatch(positionsActions.update(data.positions));
      }
      if (data.events) {
        displayNotifications(data.events);
      }
    };
  };

  useEffectAsync(async () => {
    const response = await fetch('/api/server');
    if (response.ok) {
      dispatch(sessionActions.updateServer(await response.json()));
    }
  }, []);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/devices');
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      }
      connectSocket();
      return () => {
        const socket = socketRef.current;
        if (socket) {
          socket.close();
        }
      };
    }
    const response = await fetch('/api/session');
    if (response.ok) {
      dispatch(sessionActions.updateUser(await response.json()));
    } else {
      history.push('/login');
    }
    return null;
  }, [authenticated]);

  return null;
};

export default connect()(SocketController);
