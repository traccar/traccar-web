import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from './store';
import { useHistory } from 'react-router-dom';
import { isWidthUp, makeStyles, withWidth } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import LinearProgress from '@material-ui/core/LinearProgress';

import DeviceList from './DeviceList';
import MainMap from './MainMap';
import MainToobar from './MainToolbar';
import SocketController from './SocketController';

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

const MainPage = ({ width }) => {
  const dispatch = useDispatch();
  const authenticated = useSelector(state => state.session.authenticated);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    if (!authenticated) {
      fetch('/api/session').then(response => {
        if (response.ok) {
          dispatch(sessionActions.authenticated(true));
        } else {
          history.push('/login');
        }
      });
    }
  }, [authenticated]);

  return !authenticated ? (<LinearProgress />) : (
    <div className={classes.root}>
      <SocketController />
      <MainToobar />
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp('sm', width) ? "left" : "bottom"}
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
    </div>
  );
}

export default withWidth()(MainPage);
