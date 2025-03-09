import {
  Snackbar, Alert, Dialog, DialogContent, DialogContentText, DialogActions, Typography,
  Button,
  Link,
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '../../reactHelper';
import { errorsActions } from '../../store';
import { useAdministrator } from '../util/permissions';
import { useTranslation } from './LocalizationProvider';

const ErrorHandler = () => {
  const dispatch = useDispatch();
  const t = useTranslation();
  const admin = useAdministrator();

  const error = useSelector((state) => state.errors.errors.find(() => true));
  const cachedError = usePrevious(error);

  const message = error || cachedError;
  const multiline = message?.includes('\n');
  const displayMessage = multiline ? message.split('\n')[0] : message;

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Snackbar open={Boolean(error) && !expanded}>
        <Alert
          elevation={6}
          onClose={() => dispatch(errorsActions.pop())}
          severity="error"
          variant="filled"
        >
          Something went wrong
          {' '}
          { admin ?? `: ${displayMessage}`}
          {(multiline && admin) && (
            <Link color="inherit" href="#" onClick={() => setExpanded(true)}>{t('sharedShowDetails')}</Link>
          )}
        </Alert>
      </Snackbar>
      <Dialog
        open={expanded}
        onClose={() => setExpanded(false)}
        maxWidth={false}
      >
        <DialogContent>
          <DialogContentText>
            <Typography variant="caption">
              <pre>{message}</pre>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpanded(false)} autoFocus>{t('sharedHide')}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ErrorHandler;
