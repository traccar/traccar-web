import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, IconButton, Toolbar, Paper } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Hls from 'hls.js/light';
import { useTranslation } from '../common/components/LocalizationProvider';
import BackIcon from '../common/components/BackIcon';

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
}));

const StreamPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [error, setError] = useState(false);

  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('deviceId');

  const device = useSelector((state) => state.devices.items[deviceId]);

  useEffect(() => {
    const url = `/api/stream/${device.uniqueId}/live.m3u8`;

    const hls = new Hls();
    hlsRef.current = hls;
    hls.loadSource(url);
    hls.attachMedia(videoRef.current);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoRef.current.play();
    });
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        setError(true);
      }
    });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [device]);

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
        </Toolbar>
      </Paper>
      <div className={classes.video}>
        {error ? (
          <Typography>{t('errorConnection')}</Typography>
        ) : (
          <video ref={videoRef} className={classes.player} autoPlay muted controls />
        )}
      </div>
    </div>
  );
};

export default StreamPage;
