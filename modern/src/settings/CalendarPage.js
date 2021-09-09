import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DropzoneArea } from 'material-ui-dropzone';
import EditItemView from '../EditItemView';
import EditAttributesView from '../attributes/EditAttributesView';
import { useTranslation } from '../LocalizationProvider';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const CalendarPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [item, setItem] = useState();

  const handleFiles = (files) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const { result } = event.target;
        setItem({ ...item, data: result.substr(result.indexOf(',') + 1) });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setItem({ ...item, data: null });
    }
  };

  return (
    <EditItemView endpoint="calendars" item={item} setItem={setItem}>
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
              <DropzoneArea
                filesLimit={1}
                onChange={handleFiles}
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
                definitions={{}}
              />
            </AccordionDetails>
          </Accordion>
        </>
        )}
    </EditItemView>
  );
};

export default CalendarPage;
