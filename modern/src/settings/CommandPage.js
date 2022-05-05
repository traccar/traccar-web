import React, { useState } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, TextField,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditItemView from '../EditItemView';
import { useTranslation } from '../LocalizationProvider';
import BaseCommandView from './BaseCommandView';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const CommandPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const validate = () => item && item.type;

  return (
    <EditItemView endpoint="commands" item={item} setItem={setItem} validate={validate}>
      {item && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              margin="normal"
              value={item.description || ''}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              label={t('sharedDescription')}
              variant="filled"
            />
            <BaseCommandView item={item} setItem={setItem} />
          </AccordionDetails>
        </Accordion>
      )}
    </EditItemView>
  );
};

export default CommandPage;
