import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import t from './common/localization';
import EditItemView from './EditItemView';
import EditAttributesView from './attributes/EditAttributesView';
import geofenceAttributes from './attributes/geofenceAttributes';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const GeofencePage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  return (
    <EditItemView endpoint="geofences" item={item} setItem={setItem}>
      {item
        && (
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
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
                variant="filled"
              />
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
                setAttributes={(attributes) => setItem({ ...item, attributes })}
                definitions={geofenceAttributes}
              />
            </AccordionDetails>
          </Accordion>
        </>
        )}
    </EditItemView>
  );
};

export default GeofencePage;
