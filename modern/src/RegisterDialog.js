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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const submitDisabled = () => {
    return !name || !/(.+)@(.+)\.(.{2,})/.test(email) || !password;
  }

  const handleRegister = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({name, email, password})
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
            label={t('sharedName')}
            name='name'
            value={name || ''}
            autoComplete='name'
            autoFocus
            onChange={event => setName(event.target.value)} />
          <TextField
            margin='normal'
            required
            fullWidth
            type='email' 
            label={t('userEmail')}
            name='email'
            value={email || ''}
            autoComplete='email'
            onChange={event => setEmail(event.target.value)} />
          <TextField
            margin='normal'
            required
            fullWidth
            label={t('userPassword')}
            name='password'
            value={password || ''}
            type='password'
            autoComplete='current-password'
            onChange={event => setPassword(event.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleRegister} disabled={submitDisabled()}>{t('loginRegister')}</Button>
          <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
        </DialogActions>
      </Dialog>
    )

  }
};

export default RegisterDialog;
