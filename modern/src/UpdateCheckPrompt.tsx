import { Snackbar, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import React from 'react'
import { useTranslation } from './common/components/LocalizationProvider';
import { useAttributePreference } from './common/util/preferences';
import { useRegisterSW } from 'virtual:pwa-register/react'

// Based on https://vite-pwa-org.netlify.app/frameworks/react.html
function UpdateCheckPrompt() {
  const t = useTranslation();

  const serviceWorkerUpdateInterval = useAttributePreference('serviceWorkerUpdateInterval', 3600000);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, swRegistration) {
      if (serviceWorkerUpdateInterval > 0 && swRegistration) {
        setInterval(async () => {
          if (!(!swRegistration.installing && navigator)) {
            return;
          }
    
          if (('connection' in navigator) && !navigator.onLine) {
            return;
          }
    
          const newSW = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
              'cache': 'no-store',
              'cache-control': 'no-cache',
            },
          });
    
          if (newSW?.status === 200) {
            await swRegistration.update();
          }
        }, serviceWorkerUpdateInterval);
      }
    }
  });

  return (
    <Snackbar 
      open={needRefresh} 
      message={t('settingsUpdateAvailable')}
      action={(
        <IconButton color="inherit" onClick={() => updateServiceWorker(true)}>
          <RefreshIcon />
        </IconButton>
      )}
    />
  );
}

export default UpdateCheckPrompt;
