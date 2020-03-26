import React, { Component } from 'react';
import ContainerDimensions from 'react-container-dimensions';
import MainToobar from './MainToolbar';
import MainMap from './MainMap';
import Drawer from '@material-ui/core/Drawer';
import withStyles from '@material-ui/core/styles/withStyles';
import SocketController from './SocketController';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeviceList from './DeviceList';

const styles = theme => ({});

class ReouteReportPage extends Component {
  render() {
    return (
      <div>
        <MainToobar history={this.props.history} />
      </div>
    );
  }
}

export default withWidth()(withStyles(styles)(ReouteReportPage));
