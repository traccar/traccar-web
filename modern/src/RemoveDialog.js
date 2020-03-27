import t from './common/localization'
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

class RemoveDialog extends Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={() => { this.props.onClose() }}>
        <DialogContent>
          <DialogContentText>{t('sharedRemoveConfirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary">{t('sharedRemove')}</Button>
          <Button color="primary" autoFocus>{t('sharedCancel')}</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RemoveDialog;
