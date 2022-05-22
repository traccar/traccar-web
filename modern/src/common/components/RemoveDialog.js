import React from 'react';
import Button from '@material-ui/core/Button';
import { Snackbar, makeStyles } from '@material-ui/core';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { snackBarDurationLongMs } from '../util/duration';

const useStyles = makeStyles((theme) => ({
  button: {
    height: 'auto',
    marginTop: 0,
    marginBottom: 0,
    color: theme.palette.colors.negative,
  },
}));

const RemoveDialog = ({
  open, endpoint, itemId, onResult,
}) => {
  const classes = useStyles();
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
    <Snackbar
      open={open}
      autoHideDuration={snackBarDurationLongMs}
      onClose={() => onResult(false)}
      message={t('sharedRemoveConfirm')}
      action={(
        <Button size="small" className={classes.button} onClick={handleRemove}>
          {t('sharedRemove')}
        </Button>
      )}
    />
  );
};

export default RemoveDialog;
