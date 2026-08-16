import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, IconButton, Toolbar, Paper, TextField } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { default as Hls, Events, ErrorTypes } from 'hls.js/light';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useCatchCallback } from '../reactHelper';
import BackIcon from '../common/components/BackIcon';
import fetchOrThrow from '../common/util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  title: {
    flexGrow: 1,
  },
  channel: {
    marginInline: theme.spacing(1),
  },
}));

const ChannelPlayer = ({ classes, deviceId, channel, setError, sendCommand }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let retryTimeout;

    setError(false);
    sendCommand('videoStart', { index: channel });

    const hls = new Hls();
    hls.loadSource(`/api/stream/${deviceId}/${channel}/live.m3u8`);
    hls.attachMedia(videoRef.current);
    hls.on(Events.MANIFEST_PARSED, () => videoRef.current?.play());
    hls.on(Events.ERROR, (_, data) => {
      if (!data.fatal) {
        return;
      }
      setError(true);
      clearTimeout(retryTimeout);
      retryTimeout = setTimeout(() => {
        setError(false);
        if (data.type === ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.startLoad();
        }
      }, 5000);
    });

    return () => {
      clearTimeout(retryTimeout);
      hls.destroy();
      sendCommand('videoStop', { index: channel });
    };
  }, [deviceId, channel, sendCommand, setError]);

  return <video ref={videoRef} className={classes.player} autoPlay muted controls />;
};

const StreamPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const [channel, setChannel] = useState(1);
  const [activeChannel, setActiveChannel] = useState(null);
  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');
  const device = useSelector((state) => state.devices.items[deviceId]);

  const playing = activeChannel !== null;

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
          <TextField
            size="small"
            type="number"
            value={channel}
            onChange={(event) => setChannel(Number(event.target.value) || 1)}
            label={t('commandIndex')}
            disabled={playing}
            className={classes.channel}
          />
          <IconButton
            edge="end"
            color={playing ? 'error' : 'primary'}
            onClick={() => {
              setError(false);
              setActiveChannel(playing ? null : channel);
            }}
          >
            {playing ? <StopIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Toolbar>
      </Paper>
      <div className={classes.video}>
        {error && <Typography>{t('errorConnection')}</Typography>}
        {playing && (
          <ChannelPlayer
            classes={classes}
            deviceId={deviceId}
            channel={activeChannel}
            setError={setError}
            sendCommand={sendCommand}
          />
        )}
      </div>
    </div>
  );
};

export default StreamPage;
