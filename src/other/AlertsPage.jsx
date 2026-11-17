import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Avatar,
  Button,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useTranslation } from '../common/components/LocalizationProvider';
import BottomMenu from '../common/components/BottomMenu';
import { formatAlarm, formatTime } from '../common/util/formatter';
import { prefixString } from '../common/util/stringUtils';
import { useRestriction } from '../common/util/permissions';
import useFeatures from '../common/util/useFeatures';
import fetchOrThrow from '../common/util/fetchOrThrow';
import { useAsyncTask } from '../reactHelper';
import { devicesActions } from '../store';
import useMarkSeen from '../common/util/useMarkSeen';

const useStyles = makeStyles()((theme, { railOffset }) => ({
  root: {
    minHeight: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3, 2),
    [theme.breakpoints.up('md')]: {
      marginLeft: railOffset,
      padding: theme.spacing(4, 5),
    },
  },
  layout: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    alignItems: 'flex-start',
    maxWidth: 1200,
  },
  main: {
    flex: '999 1 520px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  side: {
    flex: '1 1 280px',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  heading: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  card: {
    border: `1px solid ${theme.palette.divider}`,
    overflow: 'hidden',
  },
  sideCard: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
  row: {
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-of-type': {
      borderBottom: 'none',
    },
  },
  rowText: {
    flex: '1 1 200px',
    minWidth: 0,
  },
  rowActions: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  empty: {
    padding: theme.spacing(4, 2),
    textAlign: 'center',
  },
  rule: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const AlertsPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();
  const features = useFeatures();
  const readonly = useRestriction('readonly');

  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const rail = desktop && !features.disableTabs;
  const { classes } = useStyles({ railOffset: rail ? theme.dimensions.railWidth : '0px' });

  const devices = useSelector((state) => state.devices.items);
  // All pending notifications of this user (alarms and other subscribed events) until marked as seen
  const pending = useSelector((state) => state.events.items);
  const markSeen = useMarkSeen();

  const [tab, setTab] = useState('open');
  const [todayEvents, setTodayEvents] = useState(null);
  const [rules, setRules] = useState([]);

  // Stable key so the request only reruns when the set of devices changes
  const deviceKey = Object.keys(devices).join(',');

  useAsyncTask(
    async ({ signal }) => {
      if (tab !== 'today') {
        return;
      }
      const deviceIds = deviceKey ? deviceKey.split(',') : [];
      if (!deviceIds.length) {
        setTodayEvents([]);
        return;
      }
      const query = new URLSearchParams({
        from: dayjs().startOf('day').toISOString(),
        to: dayjs().toISOString(),
      });
      deviceIds.forEach((id) => query.append('deviceId', id));
      query.append('type', 'allEvents');
      const response = await fetchOrThrow(`api/reports/events?${query.toString()}`, { signal });
      const items = await response.json();
      setTodayEvents(
        items.sort((a, b) => dayjs(b.eventTime).valueOf() - dayjs(a.eventTime).valueOf()),
      );
    },
    [tab, deviceKey],
  );

  useAsyncTask(async ({ signal }) => {
    const response = await fetchOrThrow('api/notifications', { signal });
    setRules(await response.json());
  }, []);

  const eventLabel = (event) =>
    event.type === 'alarm'
      ? formatAlarm(event.attributes.alarm, t)
      : t(prefixString('event', event.type));

  const showOnMap = (deviceId) => {
    dispatch(devicesActions.selectId(deviceId));
    navigate('/');
  };

  const acknowledge = (event) => markSeen([event]);
  const acknowledgeAll = () => markSeen(pending);

  const items = tab === 'open' ? pending : todayEvents || [];

  const renderRow = (event) => {
    const alarm = event.type === 'alarm';
    const color = alarm ? theme.palette.warning.main : theme.palette.text.secondary;
    return (
      <ListItem key={event.id} className={classes.row}>
        <ListItemAvatar>
          <Avatar variant="rounded" style={{ backgroundColor: alpha(color, 0.14), color }}>
            {alarm ? <WarningAmberIcon /> : <EventNoteIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          className={classes.rowText}
          primary={eventLabel(event)}
          secondary={`${devices[event.deviceId]?.name || ''} · ${formatTime(event.eventTime, 'seconds')}`}
          slotProps={{ primary: { fontWeight: 600 } }}
        />
        <div className={classes.rowActions}>
          {tab === 'open' && (
            <Button size="small" variant="outlined" onClick={() => acknowledge(event)}>
              {t('sharedAcknowledge')}
            </Button>
          )}
          <Button size="small" onClick={() => showOnMap(event.deviceId)}>
            {t('alertsShowOnMap')}
          </Button>
        </div>
      </ListItem>
    );
  };

  return (
    <>
      {rail && <BottomMenu rail />}
      <div className={classes.root}>
        <div className={classes.layout}>
          <main className={classes.main}>
            <div className={classes.heading}>
              <Typography variant="h4" component="h1">
                {t('alertsTitle')}
              </Typography>
              {tab === 'open' && pending.length > 0 && (
                <Button variant="outlined" color="inherit" onClick={acknowledgeAll}>
                  {t('alertsAcknowledgeAll')}
                </Button>
              )}
            </div>
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab value="open" label={`${t('alertsOpen')} (${pending.length})`} />
              <Tab value="today" label={t('reportToday')} />
            </Tabs>
            <Paper elevation={0} className={classes.card}>
              {items.length ? (
                <List disablePadding>{items.map(renderRow)}</List>
              ) : (
                <Typography color="textSecondary" className={classes.empty}>
                  {tab === 'open' ? t('alertsEmpty') : t('sharedNoData')}
                </Typography>
              )}
            </Paper>
          </main>
          {!readonly && (
            <aside className={classes.side}>
              <Paper elevation={0} className={classes.sideCard}>
                <Typography variant="h6" component="h2">
                  {t('alertsRules')}
                </Typography>
                {rules.map((rule) => (
                  <div key={rule.id} className={classes.rule}>
                    <Typography fontWeight={600}>
                      {rule.description || t(prefixString('event', rule.type))}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {[
                        rule.attributes?.alarms
                          ?.split(',')
                          .map((it) => formatAlarm(it, t))
                          .join(', '),
                        rule.always ? t('notificationAlways') : null,
                        rule.notificators,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </div>
                ))}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/settings/notification')}
                >
                  {t('sharedAdd')}
                </Button>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate('/settings/notifications')}
                >
                  {t('sharedNotifications')}
                </Link>
              </Paper>
            </aside>
          )}
        </div>
      </div>
    </>
  );
};

export default AlertsPage;
