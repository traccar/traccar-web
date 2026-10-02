import {
  Snackbar,
  Alert,
  Button,
  Link,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '../../reactHelper';
import { errorsActions } from '../../store';
import { useTranslation } from './LocalizationProvider';
import { snackBarDurationLongMs } from '../util/duration';

const MessageHandler = () => {
  const dispatch = useDispatch();
  const t = useTranslation();

  const messages = useSelector((state) => state.errors.errors);
  const hasMessage = messages.length > 0;
  const currentMessage = messages[0];
  const cachedMessage = usePrevious(currentMessage);

  const activeMessage = hasMessage ? currentMessage : cachedMessage;
  const message =
    (typeof activeMessage === 'string' ? activeMessage : activeMessage?.message) ||
    t('errorGeneral');
  const severity = activeMessage?.severity || 'error';
  const multiline = message.includes('\n');
  const displayMessage = multiline
    ? message.split('\n')[0].replace(/^(?:(?:[\w$]+\.)*[\w$]+(?:Exception|Error)?:\s*)+/i, '')
    : message;

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Snackbar
        key={`${severity}:${message}`}
        open={hasMessage && !expanded}
        autoHideDuration={severity === 'error' ? null : snackBarDurationLongMs}
        onClose={(_, reason) => {
          if (severity !== 'error' && reason !== 'clickaway') {
            dispatch(errorsActions.pop());
          }
        }}
      >
        <Alert
          elevation={6}
          onClose={() => dispatch(errorsActions.pop())}
          severity={severity}
          variant="filled"
        >
          {displayMessage}
          {multiline && (
            <>
              {' | '}
              <Link color="inherit" href="#" onClick={() => setExpanded(true)}>
                {t('sharedShowDetails')}
              </Link>
            </>
          )}
        </Alert>
      </Snackbar>
      <Dialog open={expanded} onClose={() => setExpanded(false)} maxWidth={false}>
        <DialogContent>
          <DialogContentText component="div">
            <Typography component="pre" variant="caption">
              {message}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExpanded(false)} autoFocus>
            {t('sharedHide')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MessageHandler;
