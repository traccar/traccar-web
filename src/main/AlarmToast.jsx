import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Paper, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from '../common/components/LocalizationProvider';
import { formatAlarm, formatTime } from '../common/util/formatter';
import { devicesActions } from '../store';

const useStyles = makeStyles()((theme) => ({
  root: {
    position: 'fixed',
    zIndex: 6,
    left: '50%',
    transform: 'translateX(-50%)',
    maxWidth: `calc(100vw - ${theme.spacing(4)})`,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1, 1, 1, 2),
    backgroundColor: theme.palette.alwaysDark.main,
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
      top: theme.spacing(2),
      left: `calc(50% + ${theme.dimensions.drawerWidthDesktop} / 2)`,
    },
    [theme.breakpoints.down('md')]: {
      top: theme.spacing(10),
    },
  },
  dot: {
    width: 10,
    height: 10,
    flex: '0 0 10px',
    borderRadius: 5,
    backgroundColor: '#FB923C',
  },
  text: {
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  view: {
    flexShrink: 0,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.alwaysDark.main,
    '&:hover': {
      backgroundColor: '#E5E7EB',
    },
  },
}));

// Shows the newest unacknowledged alarm on top of the map until it is viewed or hidden.
const AlarmToast = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const events = useSelector((state) => state.events.items);
  const [hiddenIds, setHiddenIds] = useState([]);

  const event = events.find((e) => e.type === 'alarm' && !hiddenIds.includes(e.id));
  if (!event) {
    return null;
  }

  const hide = () => setHiddenIds([...hiddenIds, event.id]);
  const view = () => {
    dispatch(devicesActions.selectId(event.deviceId));
    hide();
  };

  return (
    <Paper elevation={9} className={classes.root} role="alert">
      <span className={classes.dot} />
      <Typography variant="body2" className={classes.text}>
        <strong>{formatAlarm(event.attributes.alarm, t)}</strong>
        {` · ${devices[event.deviceId]?.name || ''} · ${formatTime(event.eventTime, 'seconds')}`}
      </Typography>
      <Button size="small" className={classes.view} onClick={view}>
        {t('reportShow')}
      </Button>
      <IconButton size="small" color="inherit" aria-label={t('sharedHide')} onClick={hide}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default AlarmToast;
