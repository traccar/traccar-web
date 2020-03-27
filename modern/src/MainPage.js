import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';

import MainMap from './MainMap';
import SocketController from './SocketController';
import MainToobar from './MainToolbar';
import DeviceList from './DeviceList';

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    flexDirection: "row",
    [theme.breakpoints.down('xs')]: {
      flexDirection: "column-reverse"
    }
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350
    },
    [theme.breakpoints.down('xs')]: {
      height: 250
    }
  },
  mapContainer: {
    flexGrow: 1
  }
}));

const MainPage = () => {
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetch('/api/session').then(response => {
      if (response.ok) {
        setLoading(false);
      } else {
        history.push('/login');
      }
    });
  }, [history]);

  return (loading ? (<div>Loading...</div>) : (<div className={classes.root}>
    <SocketController />
    <MainToobar history={history} />
    <div className={classes.content}>
      { /* <Drawer
        anchor={isWidthUp('sm', this.props.width) ? "left" : "bottom"} NOTE: What's this do?
        variant="permanent"
      classes={{ paper: classes.drawerPaper }}> */}
      <Drawer
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}>
        <DeviceList />
      </Drawer>
      <div className={classes.mapContainer}>
        <ContainerDimensions>
          <MainMap />
        </ContainerDimensions>
      </div>
    </div>
  </div>));
}

export default MainPage;
