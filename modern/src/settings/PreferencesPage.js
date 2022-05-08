import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, Container, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useLocalization, useTranslation } from '../common/components/LocalizationProvider';
import OptionsLayout from './components/OptionsLayout';
import usePersistedState from '../common/util/usePersistedState';

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

  const [mapLiveRoutes, setMapLiveRoutes] = usePersistedState('mapLiveRoutes', false);
  const [mapFollow, setMapFollow] = usePersistedState('mapFollow', false);
  const [mapCluster, setMapCluster] = usePersistedState('mapCluster', true);

  return (
    <OptionsLayout>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('mapTitle')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControlLabel
              control={<Checkbox checked={mapLiveRoutes} onChange={(event) => setMapLiveRoutes(event.target.checked)} />}
              label={t('mapLiveRoutes')}
            />
            <FormControlLabel
              control={<Checkbox checked={mapFollow} onChange={(event) => setMapFollow(event.target.checked)} />}
              label={t('deviceFollow')}
            />
            <FormControlLabel
              control={<Checkbox checked={mapCluster} onChange={(event) => setMapCluster(event.target.checked)} />}
              label={t('mapClustering')}
            />
          </AccordionDetails>
        </Accordion>
      </Container>
    </OptionsLayout>
  );
};

export default PreferencesPage;
