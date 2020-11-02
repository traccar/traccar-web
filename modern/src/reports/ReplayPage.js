import React from 'react';
import { makeStyles } from '@material-ui/core';
import MainToolbar from '../MainToolbar';
import Map from '../map/Map';

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
  mapContainer: {
    flexGrow: 1,
  },
}));

const ReplayPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainToolbar />
      <Map>
      </Map>
    </div>
  );
}

export default ReplayPage;
