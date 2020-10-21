import React from 'react';
import { useSelector } from 'react-redux';
import { isWidthUp, makeStyles, withWidth } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import ContainerDimensions from 'react-container-dimensions';
import LinearProgress from '@material-ui/core/LinearProgress';
import DevicesList from './DevicesList';
import MainMap from './MainMap';
import MainToolbar from './MainToolbar';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flexGrow: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column-reverse',
    }
  },
  drawerPaper: {
    position: 'relative',
    [theme.breakpoints.up('sm')]: {
      width: 350,
    },
    [theme.breakpoints.down('xs')]: {
      height: 250,
    }
  },
  mapContainer: {
    flexGrow: 1,
  },
}));

const MainPage = ({ width }) => {
  const initialized = useSelector(state => !!state.session.server && !!state.session.user);
  const classes = useStyles();

  return !initialized ? (<LinearProgress />) : (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Drawer
          anchor={isWidthUp('sm', width) ? 'left' : 'bottom'}
          variant='permanent'
          classes={{ paper: classes.drawerPaper }}>
          <DevicesList />
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
