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

const UserPage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  return (
    <EditItemView endpoint="users" setItem={setItem} getItem={() => item}>
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
                onChange={event => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.email}
                onChange={event => setItem({...item, email: event.target.value})}
                label={t('userEmail')}
                variant="filled" />
              <TextField
                margin="normal"
                type="password"
                onChange={event => setItem({...item, password: event.target.value})}
                label={t('userPassword')}
                variant="filled" />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default UserPage;
