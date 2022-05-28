import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocalization, useTranslation, useTranslationKeys } from '../common/components/LocalizationProvider';
import usePersistedState from '../common/util/usePersistedState';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { prefixString, unprefixString } from '../common/util/stringUtils';
import SelectField from '../common/components/SelectField';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const PreferencesPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const { languages, language, setLanguage } = useLocalization();
  const languageList = Object.entries(languages).map((values) => ({ code: values[0], name: values[1].name }));

  const positionAttributes = usePositionAttributes(t);
  const [positionItems, setPositionItems] = usePersistedState('positionItems', ['speed', 'address', 'totalDistance', 'course']);

  const [mapLiveRoutes, setMapLiveRoutes] = usePersistedState('mapLiveRoutes', false);
  const [mapFollow, setMapFollow] = usePersistedState('mapFollow', false);
  const [mapCluster, setMapCluster] = usePersistedState('mapCluster', true);
  const [mapMapOnSelect, setMapOnSelect] = usePersistedState('mapOnSelect', false);

  const alarms = useTranslationKeys((it) => it.startsWith('alarm')).map((it) => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  const [soundEvents, setSoundEvents] = usePersistedState('soundEvents', []);
  const [soundAlarms, setSoundAlarms] = usePersistedState('soundAlarms', ['sos']);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedPreferences']}>
      <Container maxWidth="xs" className={classes.container}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedPreferences')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <FormControl>
              <InputLabel>{t('loginLanguage')}</InputLabel>
              <Select
                label={t('loginLanguage')}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
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
            <FormControl>
              <InputLabel>{t('sharedAttributes')}</InputLabel>
              <Select
                label={t('sharedAttributes')}
                value={positionItems}
                onChange={(e) => setPositionItems(e.target.value)}
                multiple
              >
                {Object.keys(positionAttributes).map((key) => (
                  <MenuItem key={key} value={key}>{positionAttributes[key].name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={mapLiveRoutes} onChange={(e) => setMapLiveRoutes(e.target.checked)} />}
                label={t('mapLiveRoutes')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapFollow} onChange={(e) => setMapFollow(e.target.checked)} />}
                label={t('deviceFollow')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapCluster} onChange={(endpoint) => setMapCluster(e.target.checked)} />}
                label={t('mapClustering')}
              />
              <FormControlLabel
                control={<Checkbox checked={mapMapOnSelect} onChange={(e) => setMapOnSelect(e.target.checked)} />}
                label={t('mapOnSelect')}
              />
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedSound')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <SelectField
              multiple
              value={soundEvents}
              onChange={(e) => setSoundEvents(e.target.value)}
              endpoint="/api/notifications/types"
              keyGetter={(it) => it.type}
              titleGetter={(it) => t(prefixString('event', it.type))}
              label={t('reportEventTypes')}
            />
            <SelectField
              multiple
              value={soundAlarms}
              onChange={(e) => setSoundAlarms(e.target.value)}
              data={alarms}
              keyGetter={(it) => it.key}
              label={t('sharedAlarms')}
            />
          </AccordionDetails>
        </Accordion>
      </Container>
    </PageLayout>
  );
};

export default PreferencesPage;
