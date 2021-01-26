import t from './common/localization'
import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

const RegisterDialog = ({ open, onResult }) => {
  const [formFields, setFormFields] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [errorResponse, setErrorResponse] = useState(null);

  const handleChange = (event) => {
    setFormFields({ ...formFields, [event.target.name]: event.target.value });
    setValidationErrors({ ...validationErrors, [event.target.name]: false });
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorResponse(null);
    let objErrors = {};
    if (formFields.name.trim() === '') {
      objErrors.name = true;
    }
    if (!
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(formFields.email)) {
      objErrors.email = true;
    }
    if (formFields.password.trim() === '') {
      objErrors.password = true;
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
      onResult(true)
    } else {
      setErrorResponse(t('errorGeneral'));
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => { onResult(false) }}>
      <DialogContent>
        <DialogContentText>{t('loginRegister')}</DialogContentText>

        {errorResponse && <Alert severity="error">{errorResponse}</Alert>}

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
          helperText={validationErrors.name && 'Name is required'} />

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
          helperText={validationErrors.email && 'Invalid e-mail'} />

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
          helperText={validationErrors.password && 'Password is required'} />

      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleRegister} disabled={!formFields.name || !formFields.email || !formFields.password}>{t('loginRegister')}</Button>
        <Button autoFocus onClick={() => onResult(false)}>{t('sharedCancel')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterDialog;
