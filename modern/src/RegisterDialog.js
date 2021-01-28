import t from './common/localization'
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

const RegisterDialog = ({ showDialog, onResult }) => {
  const [formFields, setFormFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
    setValidationErrors({ ...validationErrors, [event.target.name]: false });
  }

  const handleRegister = async (event) => {
    let objErrors = {};
    if (!/(.+)@(.+)\.(.{2,})/.test(formFields.email)) {
      objErrors.email = true;
    }
    if (Object.keys(objErrors).length !== 0) {
      setValidationErrors(objErrors);
      return;
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formFields)
    });

    if (response.ok) {
      showDialog = false;
      setSnackbarOpen(true);
    }
  }

  if (snackbarOpen) {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => { onResult(true) }}
        message={t('loginCreated')} />
    );
  } else if (showDialog) {
    return (
      <Dialog
        open={true}
        onClose={() => { onResult(false) }}>
        <DialogContent>
          <DialogContentText>{t('loginRegister')}</DialogContentText>
          <TextField
            margin='normal'
            required
            fullWidth
            error={validationErrors.name}
            label={t('sharedName')}
            name='name'
            value={formFields.name || ''}
            autoComplete='name'
            autoFocus
            onChange={handleChange}
            helperText={validationErrors.name && t('sharedRequired')} />
          <TextField
            margin='normal'
            required
            fullWidth
            error={validationErrors.email}
            label={t('userEmail')}
            name='email'
            value={formFields.email || ''}
            autoComplete='email'
            onChange={handleChange}
            helperText={validationErrors.email && t('sharedRequired')} />
          <TextField
            margin='normal'
            required
            fullWidth
            error={validationErrors.password}
            label={t('userPassword')}
            name='password'
            value={formFields.password || ''}
            type='password'
            autoComplete='current-password'
            onChange={handleChange}
            helperText={validationErrors.password && t('sharedRequired')} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleRegister} disabled={!formFields.name || !formFields.email || !formFields.password}>{t('loginRegister')}</Button>
          <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
        </DialogActions>
      </Dialog>
    )
  } else return null;

};

export default RegisterDialog;
