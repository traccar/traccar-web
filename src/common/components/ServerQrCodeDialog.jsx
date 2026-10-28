import { useState } from 'react';
import { TextField } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import QrCodeDialog from './QrCodeDialog';

const ServerQrCodeDialog = ({ open, onClose }) => {
  const t = useTranslation();
  const [serverUrl, setServerUrl] = useState(document.baseURI);
  const [queryParams, setQueryParams] = useState('');

  const fullUrl = queryParams ? `${serverUrl}?${queryParams}` : serverUrl;

  return (
    <QrCodeDialog open={open} onClose={onClose} value={fullUrl}>
      <TextField
        label={t('settingsServer')}
        value={serverUrl}
        onChange={(e) => setServerUrl(e.target.value)}
        margin="dense"
        fullWidth
      />

      <TextField
        label={t('commandConfiguration')}
        value={queryParams}
        onChange={(e) => setQueryParams(e.target.value)}
        margin="dense"
        fullWidth
      />
    </QrCodeDialog>
  );
};

export default ServerQrCodeDialog;
