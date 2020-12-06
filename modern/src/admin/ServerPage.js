import React from 'react';
import TextField from '@material-ui/core/TextField';

import t from '../common/localization';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, Button, FormControl, Container, Checkbox, FormControlLabel } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainToolbar from '../MainToolbar';
import { sessionActions } from '../store';
import EditAttributesView from '../attributes/EditAttributesView';
import deviceAttributes from '../attributes/deviceAttributes';
import userAttributes from '../attributes/userAttributes';

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
  details: {
    flexDirection: 'column',
  },
}));

const ServerPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const item = useSelector(state => state.session.server);
  const setItem = (updatedItem) => dispatch(sessionActions.updateServer(updatedItem));

  const handleSave = async () => {
    const response = await fetch('/api/server', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      history.goBack();
    }
  };

  return (
    <>
      <MainToolbar />
      <Container maxWidth='xs' className={classes.container}>
        {item &&
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPreferences')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <TextField
                  margin="normal"
                  value={item.announcement || ''}
                  onChange={event => setItem({...item, announcement: event.target.value})}
                  label={t('serverAnnouncement')}
                  variant="filled" />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPermissions')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <FormControlLabel
                  control={<Checkbox checked={item.registration} onChange={event => setItem({...item, registration: event.target.checked})} />}
                  label={t('serverRegistration')} />
                <FormControlLabel
                  control={<Checkbox checked={item.readonly} onChange={event => setItem({...item, readonly: event.target.checked})} />}
                  label={t('serverReadonly')} />
                <FormControlLabel
                  control={<Checkbox checked={item.deviceReadonly} onChange={event => setItem({...item, deviceReadonly: event.target.checked})} />}
                  label={t('userDeviceReadonly')} />
                <FormControlLabel
                  control={<Checkbox checked={item.limitCommands} onChange={event => setItem({...item, limitCommands: event.target.checked})} />}
                  label={t('userLimitCommands')} />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedAttributes')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <EditAttributesView
                  attributes={item.attributes}
                  setAttributes={attributes => setItem({...item, attributes})}
                  definitions={{...userAttributes, ...deviceAttributes}}
                  />
              </AccordionDetails>
            </Accordion>
          </>
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
      </Container>
    </>
  );
}

export default ServerPage;
