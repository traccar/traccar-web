import { useState } from 'react';
import { Dialog, DialogContent, DialogActions, TextField, Button, useTheme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { QRCode } from 'react-qr-code';
import { useTranslation } from './LocalizationProvider';

const useStyles = makeStyles()((theme) => ({
  qrCode: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
  },
}));

const QrCodeDialog = ({ open, onClose }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const t = useTranslation();

  const [serverUrl, setServerUrl] = useState(window.location.origin);
  const [queryParams, setQueryParams] = useState('');

  const fullUrl = queryParams ? `${serverUrl}?${queryParams}` : serverUrl;

  return (
    <Dialog oarepen={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <div className={classes.qrCode}>
          <QRCode value={fullUrl} size={theme.dimensions.qrCodeSize} />
        </div>

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
