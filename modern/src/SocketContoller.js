import { Component } from 'react';
import { connect } from 'react-redux';
import { updateDevices, updatePositions } from './actions';

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

class SocketController extends Component {
  connectSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(protocol + '//' + window.location.host + '/api/socket');

    socket.onclose = () => {
      setTimeout(() => this.connectSocket(), 60 * 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.devices) {
        this.props.dispatch(updateDevices(data.devices));
      }
      if (data.positions) {
        this.props.dispatch(updatePositions(data.positions));
      }
      if (data.events) {
        displayNotifications(data.events);
      }
    }
  }

  componentDidMount() {
    this.connectSocket();
  }

  render() {
    return null;
  }
}

export default connect()(SocketController);
