import React, { useEffect, useState } from 'react';
import MainToobar from './MainToolbar';
import { useHistory, useParams } from 'react-router-dom';
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
  const { id } = useParams();
  const [device, setDevice] = useState();
  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  useEffect(() => {
    fetch(`/api/devices/${id}`).then(response => {
      if (response.ok) {
        response.json().then(setDevice);
      }
    });
  }, [id]);

  const handleSave = () => {
    const updatedDevice = id ? device : {};
    updatedDevice.name = name || updatedDevice.name;
    updatedDevice.uniqueId = uniqueId || updatedDevice.uniqueId;

    let request;
    if (id) {
      request = fetch(`/api/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDevice),
      });
    } else {
      request = fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDevice),
      });
    }

    request.then(response => {
      if (response.ok) {
        history.goBack();
      }
    });
  }

  return (
    <>
      <MainToobar history={history} />
      <Container maxWidth='xs' className={classes.container}>
        <form>
          {(!id || device) &&
            <TextField
              margin='normal'
              fullWidth
              defaultValue={device && device.name}
              onChange={(event) => setName(event.target.value)}
              label={t('sharedName')}
              variant='filled' />
          }
          {(!id || device) &&
            <TextField
              margin='normal'
              fullWidth
              defaultValue={device && device.uniqueId}
              onChange={(event) => setUniqueId(event.target.value)}
              label={t('deviceIdentifier')}
              variant='filled' />
          }
          <FormControl fullWidth margin='normal'>
            <div className={classes.buttons}>
              <Button type='button' color='primary' variant='outlined' onClick={() => history.goBack()}>
                {t('sharedCancel')}
              </Button>
              <Button type='button' color='primary' variant='contained' onClick={handleSave}>
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
