import { Alert, Snackbar, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSelector } from 'react-redux';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useTranslation } from './common/components/LocalizationProvider';

// Based on https://vite-pwa-org.netlify.app/frameworks/react.html
const UpdateController = () => {
  const t = useTranslation();

  const swUpdateInterval = useSelector(
    (state) => state.session.server.attributes.serviceWorkerUpdateInterval || 3600000,
  );

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, swRegistration) {
      if (swUpdateInterval > 0 && swRegistration) {
        setInterval(async () => {
          if (!(!swRegistration.installing && navigator)) {
            return;
          }

          if ('connection' in navigator && !navigator.onLine) {
            return;
          }

          const newSW = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
              cache: 'no-store',
              'cache-control': 'no-cache',
            },
          });

          if (newSW?.status === 200) {
            await swRegistration.update();
          }
        }, swUpdateInterval);
      }
    },
  });

  return (
    <Snackbar open={needRefresh}>
      <Alert
        elevation={6}
        severity="info"
        variant="filled"
        action={
          <IconButton size="small" color="inherit" onClick={() => updateServiceWorker(true)}>
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
