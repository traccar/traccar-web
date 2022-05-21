import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '../../reactHelper';
import { errorsActions } from '../../store';

const ErrorHandler = () => {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.errors.errors.find(() => true));
  const previousError = usePrevious(error);

  return (
    <Snackbar open={!!error}>
      <Alert
        onClose={() => dispatch(errorsActions.pop())}
        severity="error"
      >
        {error || previousError}
      </Alert>
    </Snackbar>
  );
};

export default ErrorHandler;
