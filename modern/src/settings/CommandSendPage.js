import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, Container, Button, FormControl,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useTranslation } from '../common/components/LocalizationProvider';
import BaseCommandView from './components/BaseCommandView';
import SelectField from '../common/components/SelectField';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
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

const CommandSendPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const t = useTranslation();

  const { deviceId } = useParams();

  const [savedId, setSavedId] = useState(0);
  const [item, setItem] = useState({});

  const handleSend = useCatch(async () => {
    let command;
    if (savedId) {
      const response = await fetch(`/api/commands/${savedId}`);
      if (response.ok) {
        command = await response.json();
      } else {
        throw Error(await response.text());
      }
    } else {
      command = item;
    }

    command.deviceId = parseInt(deviceId, 10);

    const response = await fetch('/api/commands/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    });

    if (response.ok) {
      history.goBack();
    } else {
      throw Error(await response.text());
    }
  });

  const validate = () => savedId || (item && item.type);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'deviceCommand']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <SelectField
              margin="normal"
              value={savedId}
              emptyTitle={t('sharedNew')}
              onChange={(e) => setSavedId(e.target.value)}
              endpoint={`/api/commands/send?deviceId=${deviceId}`}
              titleGetter={(it) => it.description}
              label={t('sharedSavedCommand')}
              variant="filled"
            />
            {!savedId && (
              <BaseCommandView item={item} setItem={setItem} />
            )}
          </AccordionDetails>
        </Accordion>
        <FormControl fullWidth margin="normal">
          <div className={classes.buttons}>
            <Button
              type="button"
              color="primary"
              variant="outlined"
              onClick={() => history.goBack()}
            >
              {t('sharedCancel')}
            </Button>
            <Button
              type="button"
              color="primary"
              variant="contained"
              onClick={handleSend}
              disabled={!validate()}
            >
              {t('commandSend')}
            </Button>
          </div>
        </FormControl>
      </Container>
    </PageLayout>
  );
};

export default CommandSendPage;
