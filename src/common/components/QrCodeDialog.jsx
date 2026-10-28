import { Dialog, DialogContent, DialogActions, Button, useTheme } from '@mui/material';
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

const QrCodeDialog = ({ open, onClose, value, children }) => {
  const { classes } = useStyles();
  const theme = useTheme();
  const t = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <div className={classes.qrCode}>
          <QRCode
            value={value}
            size={theme.dimensions.qrCodeSize}
            title={t('sharedQrCode')}
            style={{ backgroundColor: 'white', padding: 16, maxWidth: '100%', height: 'auto' }}
          />
        </div>

        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default QrCodeDialog;
