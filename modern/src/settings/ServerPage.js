import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, Button, FormControl, Container, Checkbox, FormControlLabel, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from '../store';
import EditAttributesView from './components/EditAttributesView';
import { useTranslation } from '../common/components/LocalizationProvider';
import SelectField from '../common/components/SelectField';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useCommonUserAttributes from '../common/attributes/useCommonUserAttributes';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
  details: {
    flexDirection: 'column',
  },
}));

const ServerPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const t = useTranslation();

  const commonUserAttributes = useCommonUserAttributes(t);
  const commonDeviceAttributes = useCommonDeviceAttributes(t);

  const original = useSelector((state) => state.session.server);
  const [item, setItem] = useState({ ...original });

  const handleSave = useCatch(async () => {
    const response = await fetch('/api/server', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      dispatch(sessionActions.updateServer(await response.json()));
      history.goBack();
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'settingsServer']}>
      <Container maxWidth="xs" className={classes.container}>
        {item && (
          <>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPreferences')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <TextField
                  margin="normal"
                  value={item.mapUrl || ''}
                  onChange={(event) => setItem({ ...item, mapUrl: event.target.value })}
                  label={t('mapCustomLabel')}
                  variant="filled"
                />
                <TextField
                  margin="normal"
                  type="number"
                  value={item.latitude || 0}
                  onChange={(event) => setItem({ ...item, latitude: Number(event.target.value) })}
                  label={t('positionLatitude')}
                  variant="filled"
                />
                <TextField
                  margin="normal"
                  type="number"
                  value={item.longitude || 0}
                  onChange={(event) => setItem({ ...item, longitude: Number(event.target.value) })}
                  label={t('positionLongitude')}
                  variant="filled"
                />
                <TextField
                  margin="normal"
                  type="number"
                  value={item.zoom || 0}
                  onChange={(event) => setItem({ ...item, zoom: Number(event.target.value) })}
                  label={t('serverZoom')}
                  variant="filled"
                />
                <FormControl variant="filled" margin="normal" fullWidth>
                  <InputLabel>{t('settingsCoordinateFormat')}</InputLabel>
                  <Select
                    value={item.coordinateFormat || 'dd'}
                    onChange={(event) => setItem({ ...item, coordinateFormat: event.target.value })}
                  >
                    <MenuItem value="dd">{t('sharedDecimalDegrees')}</MenuItem>
                    <MenuItem value="ddm">{t('sharedDegreesDecimalMinutes')}</MenuItem>
                    <MenuItem value="dms">{t('sharedDegreesMinutesSeconds')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="filled" margin="normal" fullWidth>
                  <InputLabel>{t('settingsSpeedUnit')}</InputLabel>
                  <Select
                    value={item.attributes.speedUnit || 'kn'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, speedUnit: e.target.value } })}
                  >
                    <MenuItem value="kn">{t('sharedKn')}</MenuItem>
                    <MenuItem value="kmh">{t('sharedKmh')}</MenuItem>
                    <MenuItem value="mph">{t('sharedMph')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="filled" margin="normal" fullWidth>
                  <InputLabel>{t('settingsDistanceUnit')}</InputLabel>
                  <Select
                    value={item.attributes.distanceUnit || 'km'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, distanceUnit: e.target.value } })}
                  >
                    <MenuItem value="km">{t('sharedKm')}</MenuItem>
                    <MenuItem value="mi">{t('sharedMi')}</MenuItem>
                    <MenuItem value="nmi">{t('sharedNmi')}</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="filled" margin="normal" fullWidth>
                  <InputLabel>{t('settingsVolumeUnit')}</InputLabel>
                  <Select
                    value={item.attributes.volumeUnit || 'ltr'}
                    onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, volumeUnit: e.target.value } })}
                  >
                    <MenuItem value="ltr">{t('sharedLiter')}</MenuItem>
                    <MenuItem value="usGal">{t('sharedUsGallon')}</MenuItem>
                    <MenuItem value="impGal">{t('sharedImpGallon')}</MenuItem>
                  </Select>
                </FormControl>
                <SelectField
                  margin="normal"
                  value={item.attributes.timezone || ''}
                  emptyValue=""
                  onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, timezone: e.target.value } })}
                  endpoint="/api/server/timezones"
                  keyGetter={(it) => it}
                  titleGetter={(it) => it}
                  label={t('sharedTimezone')}
                  variant="filled"
                />
                <TextField
                  margin="normal"
                  value={item.poiLayer || ''}
                  onChange={(event) => setItem({ ...item, poiLayer: event.target.value })}
                  label={t('mapPoiLayer')}
                  variant="filled"
                />
                <TextField
                  margin="normal"
                  value={item.announcement || ''}
                  onChange={(event) => setItem({ ...item, announcement: event.target.value })}
                  label={t('serverAnnouncement')}
                  variant="filled"
                />
                <FormControlLabel
                  control={<Checkbox checked={item.twelveHourFormat} onChange={(event) => setItem({ ...item, twelveHourFormat: event.target.checked })} />}
                  label={t('settingsTwelveHourFormat')}
                />
                <FormControlLabel
                  control={<Checkbox checked={item.forceSettings} onChange={(event) => setItem({ ...item, forceSettings: event.target.checked })} />}
                  label={t('serverForceSettings')}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedPermissions')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <FormControlLabel
                  control={<Checkbox checked={item.registration} onChange={(event) => setItem({ ...item, registration: event.target.checked })} />}
                  label={t('serverRegistration')}
                />
                <FormControlLabel
                  control={<Checkbox checked={item.readonly} onChange={(event) => setItem({ ...item, readonly: event.target.checked })} />}
                  label={t('serverReadonly')}
                />
                <FormControlLabel
                  control={<Checkbox checked={item.deviceReadonly} onChange={(event) => setItem({ ...item, deviceReadonly: event.target.checked })} />}
                  label={t('userDeviceReadonly')}
                />
                <FormControlLabel
                  control={<Checkbox checked={item.limitCommands} onChange={(event) => setItem({ ...item, limitCommands: event.target.checked })} />}
                  label={t('userLimitCommands')}
                />
                <FormControlLabel
                  control={<Checkbox checked={item.disableReports} onChange={(event) => setItem({ ...item, disableReports: event.target.checked })} />}
                  label={t('userDisableReports')}
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
                  definitions={{ ...commonUserAttributes, ...commonDeviceAttributes }}
                />
              </AccordionDetails>
            </Accordion>
          </>
        )}
        <FormControl fullWidth margin="normal">
          <div className={classes.buttons}>
            <Button type="button" color="primary" variant="outlined" onClick={() => history.goBack()}>
              {t('sharedCancel')}
            </Button>
            <Button type="button" color="primary" variant="contained" onClick={handleSave}>
              {t('sharedSave')}
            </Button>
          </div>
        </FormControl>
      </Container>
    </PageLayout>
  );
};

export default ServerPage;
