import t from './common/localization'
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const RemoveDialog = (props) => {
  const handleRemove = () => {
    fetch(`/api/devices/${props.deviceId}`, { method: 'DELETE' }).then(response => {
      if (response.ok) {
        props.onResult(true);
      }
    });
  }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={() => { props.onResult(false) }}>
        <DialogContent>
          <DialogContentText>{t('sharedRemoveConfirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleRemove}>{t('sharedRemove')}</Button>
          <Button autoFocus onClick={() => props.onResult(false)}>{t('sharedCancel')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RemoveDialog;
