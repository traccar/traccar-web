import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DropzoneArea } from 'react-mui-dropzone';
import EditItemView from './components/EditItemView';
import EditAttributesView from './components/EditAttributesView';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import components from '../common/theme/components';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
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

  const validate = () => item && item.name && item.data;

  return (
    <EditItemView
      endpoint="calendars"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedCalendar']}
    >
      {item && (
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
              />
              <DropzoneArea
                filesLimit={1}
                onChange={handleFiles}
                alertSnackbarProps={components.MuiSnackbar.defaultProps}
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
