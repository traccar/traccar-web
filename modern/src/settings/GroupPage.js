import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from '../attributes/EditAttributesView';
import deviceAttributes from '../attributes/deviceAttributes';
import SelectField from '../form/SelectField';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const GroupPage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  return (
    <EditItemView endpoint="groups" item={item} setItem={setItem}>
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
                value={item.name || ''}
                onChange={event => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
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
              <SelectField
                margin="normal"
                value={item.groupId || 0}
                onChange={event => setItem({...item, groupId: Number(event.target.value)})}
                endpoint="/api/groups"
                label={t('groupParent')}
                variant="filled" />
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
                definitions={deviceAttributes}
                />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default GroupPage;
