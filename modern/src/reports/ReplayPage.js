import React, { useState, useEffect, useRef } from 'react';
import {
  Grid, FormControlLabel, Switch, IconButton, TextField, makeStyles, Paper, Slider, Toolbar, Tooltip, Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SettingsIcon from '@material-ui/icons/Settings';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Map from '../map/Map';
import ReplayPathMap from '../map/ReplayPathMap';
import PositionsMap from '../map/PositionsMap';
import { formatPosition } from '../common/formatter';
import ReportFilter from './ReportFilter';
import { useTranslation } from '../LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  title: {
    ...theme.typography.title,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    margin: theme.spacing(1.5),
    width: theme.dimensions.drawerWidthDesktop,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: 0,
    },
  },
  formControlLabel: {
    height: '100%',
    width: '100%',
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportFilterContainer: {
    flex: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(1),
    },
  },
  sliderContainer: {
    padding: theme.spacing(2),
  },
}));

const TimeLabel = ({ children, open, value }) => (
  <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
    {children}
  </Tooltip>
);

const ReplayPage = () => {
  const t = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const timerRef = useRef();

  const [positions, setPositions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedDeviceId, setSelectedDeviceId] = useState();
  const [playbackSpeed, setPlaybackSpeed] = useState('');
  const [expanded, setExpanded] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const deviceName = useSelector((state) => {
    if (selectedDeviceId) {
      const device = state.devices.items[selectedDeviceId];
      if (device) {
        return device.name;
      }
    }
    return null;
  });

  useEffect(() => {
    if (isPlaying && positions.length > 0) {
      timerRef.current = setInterval(() => {
        console.log('in setInterval func');
        setIndex((index) => index + 1);
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, positions]);

  useEffect(() => {
    if (index >= positions.length) {
      clearInterval(timerRef.current);
    }
  }, [index]);

  const handleSubmit = async (deviceId, from, to, _, headers) => {
    setSelectedDeviceId(deviceId);
    const query = new URLSearchParams({ deviceId, from, to });
    const response = await fetch(`/api/positions?${query.toString()}`, { headers });
    if (response.ok) {
      setIndex(0);
      setPositions(await response.json());
      setExpanded(false);
    }
  };

  return (
    <div className={classes.root}>
      <Map>
        <ReplayPathMap positions={positions} />
        {index < positions.length
          && <PositionsMap positions={[positions[index]]} />}
      </Map>
      <div className={classes.sidebar}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Paper elevation={3} square>
              <Toolbar disableGutters>
                <Grid container alignItems="center">
                  <Grid item>
                    <IconButton onClick={() => history.push('/')}>
                      <ArrowBackIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs>
                    <Typography className={classes.replay} color="primary">
                      {t('reportReplay')}
                    </Typography>
                  </Grid>
                  {!expanded && (
                    <Grid item>
                      <IconButton onClick={() => setExpanded(true)}>
                        <SettingsIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Toolbar>
            </Paper>
          </Grid>
          <Grid item>
            {!expanded ? (
              <Paper className={classes.sliderContainer}>
                <Grid container direction="column" alignItems="center">
                  <Grid item>
                    <span className={classes.title}>{deviceName}</span>
                  </Grid>
                  <Grid item style={{ width: '100%' }}>
                    <Slider
                      max={positions.length - 1}
                      step={null}
                      marks={positions.map((_, index) => ({ value: index }))}
                      value={index}
                      onChange={(_, index) => setIndex(index)}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(i) => (i < positions.length ? formatPosition(positions[i], 'fixTime') : '')}
                      ValueLabelComponent={TimeLabel}
                    />
                  </Grid>
                  <Grid item container justifyContent="space-between" alignItems="center">
                    <Grid item xs={2}>{`${index}/${positions.length}`}</Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => setIndex((index) => index - 1)} disabled={isPlaying}>
                        <FastRewindIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon /> }
                      </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={() => setIndex((index) => index + 1)} disabled={isPlaying}>
                        <FastForwardIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs>{formatPosition(positions[index], 'fixTime')}</Grid>
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} className={classes.reportFilterContainer} square>
                <ReportFilter handleSubmit={handleSubmit} fullScreen showOnly>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label={t('reportPlaybackPerMinute')}
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(e.target.value)}
                      variant="filled"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControlLabel
                      classes={{ root: classes.formControlLabel }}
                      control={(
                        <Switch
                          checked={isPlaying}
                          onChange={(e) => setIsPlaying(e.target.checked)}
                          color="primary"
                          edge="start"
                        />
                      )}
                      label={t('reportAutoPlay')}
                      labelPlacement="start"
                    />
                  </Grid>
                </ReportFilter>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ReplayPage;
