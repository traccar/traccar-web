import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, Container, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { useLocalization, useTranslation } from '../LocalizationProvider';
import OptionsLayout from './OptionsLayout';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  details: {
    flexDirection: 'column',
  },
}));

const PreferencesPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  return (
    <OptionsLayout>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary>
            <Typography variant="subtitle1">
              {t('sharedPreferences')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControl variant="filled" fullWidth>
              <InputLabel>{t('loginLanguage')}</InputLabel>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {languageList.map((it) => <MenuItem key={it.code} value={it.code}>{it.name}</MenuItem>)}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      </Container>
    </OptionsLayout>
  );
};

export default PreferencesPage;
