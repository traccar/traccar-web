import t from './common/localization'
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const RemoveDialog = ({ open, endpoint, itemId, onResult }) => {
  const handleRemove = async () => {
    const response = await fetch(`/api/${endpoint}/${itemId}`, { method: 'DELETE' });
    if (response.ok) {
      onResult(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { onResult(false) }}>
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
