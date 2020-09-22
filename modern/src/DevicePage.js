import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';
import EditItemView from './EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const DevicePage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  return (
    <EditItemView endpoint="devices" setItem={setItem} getItem={() => item}>
      {item &&
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                defaultValue={item.name}
                onChange={(event) => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.uniqueId}
                onChange={(event) => setItem({...item, uniqueId: event.target.value})}
                label={t('deviceIdentifier')}
                variant="filled" />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedExtra')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                defaultValue={item.phone}
                onChange={(event) => setItem({...item, phone: event.target.value})}
                label={t('sharedPhone')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.model}
                onChange={(event) => setItem({...item, model: event.target.value})}
                label={t('deviceModel')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.contact}
                onChange={(event) => setItem({...item, contact: event.target.value})}
                label={t('deviceContact')}
                variant="filled" />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default DevicePage;
