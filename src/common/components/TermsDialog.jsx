import { useSelector } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, Link,
} from '@mui/material';
import { useTranslation } from './LocalizationProvider';

const TermsDialog = ({ open, onCancel, onAccept }) => {
  const t = useTranslation();

  const termsUrl = useSelector((state) => state.session.server.attributes.termsUrl);
  const privacyUrl = useSelector((state) => state.session.server.attributes.privacyUrl);

  return (
    <Dialog
      open={open}
      onClose={onCancel}
    >
      <DialogContent>
        <DialogContentText>
          {t('userTermsPrompt')}
          <ul>
            <li><Link href={termsUrl} target="_blank">{t('userTerms')}</Link></li>
            <li><Link href={privacyUrl} target="_blank">{t('userPrivacy')}</Link></li>
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('sharedCancel')}</Button>
        <Button onClick={onAccept}>{t('sharedAccept')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsDialog;
