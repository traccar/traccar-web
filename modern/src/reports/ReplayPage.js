import React from 'react';
import { Container, makeStyles, Paper, Slider } from '@material-ui/core';
import MainToolbar from '../MainToolbar';
import Map from '../map/Map';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  controlPanel: {
    position: 'absolute',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)',
  },
  controlContent: {
    padding: theme.spacing(2),
  },
}));

const ReplayPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainToolbar />
      <Map>
      </Map>
      <Container maxWidth="sm" className={classes.controlPanel}>
        <Paper className={classes.controlContent}>
          <Slider defaultValue={30} />
        </Paper>
      </Container>
    </div>
  );
}

export default ReplayPage;
