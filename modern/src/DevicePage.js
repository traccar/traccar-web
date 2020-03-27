import React, { Component } from 'react';
import MainToobar from './MainToolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';

const styles = theme => ({});

class DevicePage extends Component {
  render() {
    return (
      <div>
        <MainToobar history={this.props.history} />
      </div>
    );
  }
}

export default withWidth()(withStyles(styles)(DevicePage));
