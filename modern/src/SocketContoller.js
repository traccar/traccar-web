import { Component } from 'react';
import { connect } from 'react-redux';
import { updatePositions } from './actions';

class SocketController extends Component {
  connectSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(protocol + '//' + window.location.host + '/api/socket');

    socket.onclose = () => {
      setTimeout(() => this.connectSocket(), 60 * 1000);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.positions) {
        this.props.dispatch(updatePositions(data.positions));
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
