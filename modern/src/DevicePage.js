import React from 'react';
import MainToobar from './MainToolbar';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth from '@material-ui/core/withWidth';
import { useHistory } from 'react-router-dom';

const styles = theme => ({});

const DevicePage = () => {
  const history = useHistory();

  return (
    <div>
      <MainToobar history={history} />
    </div>
  );
}

export default withWidth()(withStyles(styles)(DevicePage));
