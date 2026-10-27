import { Alert, Snackbar, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Workbox } from 'workbox-window';
import { useTranslation } from './common/components/LocalizationProvider';

const UpdateController = () => {
  const t = useTranslation();

  const updateInterval = useSelector(
    (state) => state.session.server.attributes.serviceWorkerUpdateInterval || 3600000,
  );

  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
      return undefined;
    }

    const url = new URL('sw.js', document.baseURI).href;
    const workbox = new Workbox(url, { scope: document.baseURI });
    const onWaiting = () => setWaitingWorker(workbox);
    const onControlling = (event) => {
      if (event.isUpdate) window.location.reload();
    };
    workbox.addEventListener('waiting', onWaiting);
    workbox.addEventListener('controlling', onControlling);

    let interval;
    let disposed = false;
    workbox
      .register({ immediate: true })
      .then((registration) => {
        if (!disposed && registration) {
          interval = setInterval(async () => {
            if (!registration.installing && navigator.onLine) {
              const response = await fetch(url, { cache: 'no-store' });
              if (response.ok) {
                await registration.update();
              }
            }
          }, updateInterval);
        }
      })
      .catch(console.error);

    return () => {
      disposed = true;
      clearInterval(interval);
      workbox.removeEventListener('waiting', onWaiting);
      workbox.removeEventListener('controlling', onControlling);
    };
  }, [updateInterval]);

  return (
    <Snackbar open={Boolean(waitingWorker)}>
      <Alert
        elevation={6}
        severity="info"
        variant="filled"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => waitingWorker.messageSkipWaiting()}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        }
      >
        {t('settingsUpdateAvailable')}
      </Alert>
    </Snackbar>
  );
};

export default UpdateController;
