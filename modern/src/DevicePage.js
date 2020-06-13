import React from 'react';
import MainToobar from './MainToolbar';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import t from './common/localization';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
}));

const DevicePage = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <MainToobar history={history} />
      <Container maxWidth='xs' className={classes.container}>
        <form>
          <TextField margin="normal" fullWidth label={t('sharedName')} variant="filled" />
          <TextField margin="normal" fullWidth label={t('deviceIdentifier')} variant="filled" />
          <FormControl fullWidth margin="normal">
            <div className={classes.buttons}>
              <Button type="button" color="primary" variant="outlined">
                {t('sharedCancel')}
              </Button>
              <Button type="button" color="primary" variant="contained">
                {t('sharedSave')}
              </Button>
            </div>
          </FormControl>
        </form>
      </Container>
    </>
  );
}

export default DevicePage;
