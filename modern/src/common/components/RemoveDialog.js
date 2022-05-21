import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';

const RemoveDialog = ({
  open, endpoint, itemId, onResult,
}) => {
  const t = useTranslation();

  const handleRemove = useCatch(async () => {
    const response = await fetch(`/api/${endpoint}/${itemId}`, { method: 'DELETE' });
    if (response.ok) {
      onResult(true);
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <Dialog
      open={open}
      onClose={() => { onResult(false); }}
    >
      <DialogContent>
        <DialogContentText>{t('sharedRemoveConfirm')}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleRemove}>{t('sharedRemove')}</Button>
        <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveDialog;
