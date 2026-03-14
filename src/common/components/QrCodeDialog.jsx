import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import QRCode from 'react-qr-code';
import { useTranslation } from './LocalizationProvider';

const QrCodeDialog = ({ open, onClose }) => {
  const theme = useTheme();
  const t = useTranslation();

  const [serverUrl, setServerUrl] = useState(window.location.origin);
  const [queryParams, setQueryParams] = useState('');

  const fullUrl = queryParams ? `${serverUrl}?${queryParams}` : serverUrl;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Box display="flex" justifyContent="center" mb={2}>
          <QRCode value={fullUrl} size={theme.dimensions.qrCodeSize} />
        </Box>

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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrCodeDialog;
