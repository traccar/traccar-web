import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { positionsActions, devicesActions } from './store';

const displayNotifications = events => {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      for (const event of events) {
        const notification = new Notification(`Event: ${event.type}`);
        setTimeout(notification.close.bind(notification), 4 * 1000);
      }
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(permission => {
        if (permission === "granted") {
          displayNotifications(events);
        }
      });
    }
  }
};

const SocketController = (props) => {
  const dispatch = useDispatch();

  const connectSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(protocol + '//' + window.location.host + '/api/socket');

    socket.onclose = () => {
      setTimeout(() => connectSocket(), 60 * 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        props.dispatch(devicesActions.update(data.devices));
      }
      if (data.positions) {
        props.dispatch(positionsActions.update(data.positions));
      }
      if (data.events) {
        displayNotifications(data.events);
      }
    };
  }

  useEffect(() => {
    fetch('/api/devices').then(response => {
      if (response.ok) {
        response.json().then(devices => {
          dispatch(devicesActions.update(devices));
        });
      }
      connectSocket();
    });
  }, []);

  return null;
}

export default connect()(SocketController);
