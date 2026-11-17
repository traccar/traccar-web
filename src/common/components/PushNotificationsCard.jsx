import { useEffect, useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  root: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2.5),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
}));

const supported = () =>
  window.isSecureContext &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window;

// iOS only allows Web Push for apps added to the Home Screen
const needsIosInstall = () =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) &&
  !navigator.standalone &&
  !window.matchMedia('(display-mode: standalone)').matches;

const decodeKey = (value) => {
  const base64 = `${value}${'='.repeat((4 - (value.length % 4)) % 4)}`
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const currentSubscription = async () => {
  const registration = await navigator.serviceWorker.getRegistration();
  return registration ? registration.pushManager.getSubscription() : null;
};

// Turns Web Push notifications on or off for the current browser/device
const PushNotificationsCard = () => {
  const { classes } = useStyles();
  const t = useTranslation();

  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!supported()) {
      setStatus(needsIosInstall() ? 'ios' : 'unsupported');
      return;
    }
    if (Notification.permission === 'denied') {
      setStatus('denied');
      return;
    }
    currentSubscription()
      .then((subscription) => setStatus(subscription ? 'on' : 'off'))
      .catch(() => setStatus('off'));
  }, []);

  const enable = useCatch(async () => {
    setStatus('busy');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'denied' : 'off');
        return;
      }
      const registration = await navigator.serviceWorker.ready;
      const { publicKey } = await (await fetchOrThrow('api/push/key')).json();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeKey(publicKey),
      });
      await fetchOrThrow('api/push/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });
      setStatus('on');
    } catch (error) {
      setStatus('off');
      throw error;
    }
  });

  const disable = useCatch(async () => {
    setStatus('busy');
    try {
      const subscription = await currentSubscription();
      if (subscription) {
        await fetchOrThrow('api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setStatus('off');
    } catch (error) {
      setStatus('on');
      throw error;
    }
  });

  const messages = {
    ios: t('pushInstallIos'),
    unsupported: t('pushUnsupported'),
    denied: t('pushDenied'),
    on: t('pushEnabled'),
  };

  return (
    <Paper elevation={0} className={classes.root}>
      <Typography variant="h6" component="h2">
        {t('pushTitle')}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {t('pushDescription')}
      </Typography>
      {messages[status] && (
        <Typography variant="body2" color={status === 'on' ? 'success.main' : 'textSecondary'}>
          {messages[status]}
        </Typography>
      )}
      {(status === 'off' || status === 'busy') && (
        <Button variant="contained" onClick={enable} disabled={status === 'busy'}>
          {t('pushEnable')}
        </Button>
      )}
      {status === 'on' && (
        <Button variant="outlined" color="inherit" onClick={disable}>
          {t('pushDisable')}
        </Button>
      )}
    </Paper>
  );
};

export default PushNotificationsCard;
