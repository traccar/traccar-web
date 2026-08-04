import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, IconButton, Toolbar, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { default as Hls, Events, ErrorTypes } from 'hls.js/light';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useCatchCallback } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const MAX_CHANNELS = 8;
const RETRY_DELAY = 5000;

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flexGrow: 1,
  },
  grid: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  channel: {
    flex: '1 1 50%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    flexGrow: 1,
  },
  video: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const ChannelPlayer = ({ classes, deviceId, channel, sendCommand, removable, onRemove }) => {
  const t = useTranslation();
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!playing) {
      return undefined;
    }

    let destroyed = false;
    let retryTimeout;

    setError(false);
    sendCommand('videoStart', { index: channel });

    const hls = new Hls();
    hls.loadSource(`/api/stream/${deviceId}/${channel}/live.m3u8`);
    hls.attachMedia(videoRef.current);
    hls.on(Events.MANIFEST_PARSED, () => {
      if (!destroyed && videoRef.current) {
        videoRef.current.play();
      }
    });
    hls.on(Events.ERROR, (_, data) => {
      if (!data.fatal || destroyed) {
        return;
      }
      setError(true);
      clearTimeout(retryTimeout);
      retryTimeout = setTimeout(() => {
        if (destroyed) {
          return;
        }
        setError(false);
        if (data.type === ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.startLoad();
        }
      }, RETRY_DELAY);
    });

    return () => {
      destroyed = true;
      clearTimeout(retryTimeout);
      hls.destroy();
      sendCommand('videoStop', { index: channel });
    };
  }, [deviceId, channel, playing, sendCommand]);

  return (
    <div className={classes.channel}>
      <Toolbar variant="dense" disableGutters>
        <Typography className={classes.label} variant="body2">
          {channel}
        </Typography>
        {removable && (
          <IconButton size="small" onClick={() => onRemove(channel)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          size="small"
          color={playing ? 'error' : 'primary'}
          onClick={() => {
            setError(false);
            setPlaying((current) => !current);
          }}
        >
          {playing ? <StopIcon /> : <PlayArrowIcon />}
        </IconButton>
      </Toolbar>
      <div className={classes.video}>
        {error && <Typography>{t('errorConnection')}</Typography>}
        {playing && <video ref={videoRef} className={classes.player} autoPlay muted controls />}
      </div>
    </div>
  );
};

const StreamPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  const device = useSelector((state) => state.devices.items[deviceId]);

  const [channels, setChannels] = useState([1]);

  const sendCommand = useCatchCallback(
    async (type, attributes) => {
      await fetchOrThrow('/api/commands/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, type, attributes }),
      });
    },
    [deviceId],
  );

  const addChannel = () => {
    setChannels((prev) => {
      if (prev.length >= MAX_CHANNELS) {
        return prev;
      }
      let next = 1;
      while (prev.includes(next)) {
        next += 1;
      }
      return [...prev, next];
    });
  };

  const removeChannel = (channel) => {
    setChannels((prev) => (prev.length > 1 ? prev.filter((c) => c !== channel) : prev));
  };

  return (
    <div className={classes.root}>
      <Paper square>
        <Toolbar>
          <IconButton edge="start" sx={{ mr: 2 }} onClick={() => navigate(-1)}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {device?.name || t('linkLiveVideo')}
          </Typography>
          <IconButton
            edge="end"
            disabled={channels.length >= MAX_CHANNELS}
            onClick={addChannel}
            title={t('sharedAdd')}
          >
            <AddIcon />
          </IconButton>
        </Toolbar>
      </Paper>
      <div className={classes.grid}>
        {channels.map((channel) => (
          <ChannelPlayer
            key={channel}
            classes={classes}
            deviceId={deviceId}
            channel={channel}
            sendCommand={sendCommand}
            removable={channels.length > 1}
            onRemove={removeChannel}
          />
        ))}
      </div>
    </div>
  );
};

export default StreamPage;
