import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, InputAdornment, IconButton, FilledInput,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CachedIcon from '@material-ui/icons/Cached';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import EditItemView from './components/EditItemView';
import EditAttributesView from './components/EditAttributesView';
import LinkField from '../common/components/LinkField';
import { useTranslation } from '../common/components/LocalizationProvider';
import useUserAttributes from '../common/attributes/useUserAttributes';
import { sessionActions } from '../store';
import SelectField from '../common/components/SelectField';
import SettingsMenu from './components/SettingsMenu';
import useCommonUserAttributes from '../common/attributes/useCommonUserAttributes';
import { useAdministrator, useManager } from '../common/util/permissions';
import { prefixString } from '../common/util/stringUtils';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const UserPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const manager = useManager();

  const currentUserId = useSelector((state) => state.session.user.id);

  const commonUserAttributes = useCommonUserAttributes(t);
  const userAttributes = useUserAttributes(t);

  const [item, setItem] = useState();

  const onItemSaved = (result) => {
    if (result.id === currentUserId) {
      dispatch(sessionActions.updateUser(result));
    }
  };

  const validate = () => item && item.name && item.email && (item.id || item.password);

  return (
    <EditItemView
      endpoint="users"
      item={item}
      setItem={setItem}
      defaultItem={{ deviceLimit: -1 }}
      validate={validate}
      onItemSaved={onItemSaved}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'settingsUser']}
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
                margin="normal"
                value={item.name || ''}
                onChange={(event) => setItem({ ...item, name: event.target.value })}
                label={t('sharedName')}
                variant="filled"
              />
              <TextField
                margin="normal"
                value={item.email || ''}
                onChange={(event) => setItem({ ...item, email: event.target.value })}
                label={t('userEmail')}
                variant="filled"
              />
              <TextField
                margin="normal"
                type="password"
                onChange={(event) => setItem({ ...item, password: event.target.value })}
                label={t('userPassword')}
                variant="filled"
              />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedPreferences')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                margin="normal"
                value={item.phone || ''}
                onChange={(event) => setItem({ ...item, phone: event.target.value })}
                label={t('sharedPhone')}
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
                  value={(item.attributes && item.attributes.speedUnit) || 'kn'}
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
                  value={(item.attributes && item.attributes.distanceUnit) || 'km'}
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
                  value={(item.attributes && item.attributes.volumeUnit) || 'ltr'}
                  onChange={(e) => setItem({ ...item, attributes: { ...item.attributes, volumeUnit: e.target.value } })}
                >
                  <MenuItem value="ltr">{t('sharedLiter')}</MenuItem>
                  <MenuItem value="usGal">{t('sharedUsGallon')}</MenuItem>
                  <MenuItem value="impGal">{t('sharedImpGallon')}</MenuItem>
                </Select>
              </FormControl>
              <SelectField
                margin="normal"
                value={(item.attributes && item.attributes.timezone) || ''}
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
              <FormControlLabel
                control={<Checkbox checked={item.twelveHourFormat} onChange={(event) => setItem({ ...item, twelveHourFormat: event.target.checked })} />}
                label={t('settingsTwelveHourFormat')}
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
              <FormControl variant="filled" margin="normal">
                <InputLabel>{t('userToken')}</InputLabel>
                <FilledInput
                  type="text"
                  value={item.token || ''}
                  onChange={(e) => setItem({ ...item, token: e.target.value })}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton onClick={() => {
                        const token = [...Array(30)].map(() => Math.random().toString(36)[2]).join('');
                        setItem({ ...item, token });
                      }}
                      >
                        <CachedIcon />
                      </IconButton>
                    </InputAdornment>
                  )}
                />
              </FormControl>
              <TextField
                margin="normal"
                variant="filled"
                label={t('userExpirationTime')}
                type="date"
                value={(item.expirationTime && item.expirationTime.format(moment.HTML5_FMT.DATE)) || '2999-01-01'}
                onChange={(e) => setItem({ ...item, expirationTime: moment(e.target.value, moment.HTML5_FMT.DATE) })}
                disabled={!manager}
              />
              <TextField
                margin="normal"
                type="number"
                value={item.deviceLimit || 0}
                onChange={(e) => setItem({ ...item, deviceLimit: Number(e.target.value) })}
                label={t('userDeviceLimit')}
                variant="filled"
                disabled={!admin}
              />
              <TextField
                margin="normal"
                type="number"
                value={item.userLimit || 0}
                onChange={(e) => setItem({ ...item, userLimit: Number(e.target.value) })}
                label={t('userUserLimit')}
                variant="filled"
                disabled={!admin}
              />
              <FormControlLabel
                control={<Checkbox checked={item.disabled} onChange={(e) => setItem({ ...item, disabled: e.target.checked })} />}
                label={t('sharedDisabled')}
                disabled={!manager}
              />
              <FormControlLabel
                control={<Checkbox checked={item.administrator} onChange={(e) => setItem({ ...item, administrator: e.target.checked })} />}
                label={t('userAdmin')}
                disabled={!admin}
              />
              <FormControlLabel
                control={<Checkbox checked={item.readonly} onChange={(e) => setItem({ ...item, readonly: e.target.checked })} />}
                label={t('serverReadonly')}
                disabled={!manager}
              />
              <FormControlLabel
                control={<Checkbox checked={item.deviceReadonly} onChange={(e) => setItem({ ...item, deviceReadonly: e.target.checked })} />}
                label={t('userDeviceReadonly')}
                disabled={!manager}
              />
              <FormControlLabel
                control={<Checkbox checked={item.limitCommands} onChange={(e) => setItem({ ...item, limitCommands: e.target.checked })} />}
                label={t('userLimitCommands')}
                disabled={!manager}
              />
              <FormControlLabel
                control={<Checkbox checked={item.disableReports} onChange={(e) => setItem({ ...item, disableReports: e.target.checked })} />}
                label={t('userDisableReports')}
                disabled={!manager}
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
                definitions={{ ...commonUserAttributes, ...userAttributes }}
              />
            </AccordionDetails>
          </Accordion>
          {item.id && manager && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedConnections')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <LinkField
                  margin="normal"
                  endpointAll="/api/devices?all=true"
                  endpointLinked={`/api/devices?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="deviceId"
                  label={t('deviceTitle')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/groups?all=true"
                  endpointLinked={`/api/groups?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="groupId"
                  label={t('settingsGroups')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/geofences?all=true"
                  endpointLinked={`/api/geofences?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="geofenceId"
                  label={t('sharedGeofences')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/notifications?all=true"
                  endpointLinked={`/api/notifications?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="notificationId"
                  titleGetter={(it) => t(prefixString('event', it.type))}
                  label={t('sharedNotifications')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/calendars?all=true"
                  endpointLinked={`/api/calendars?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="calendarId"
                  label={t('sharedCalendars')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/users?all=true"
                  endpointLinked={`/api/users?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="managedUserId"
                  label={t('settingsUsers')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/attributes/computed?all=true"
                  endpointLinked={`/api/attributes/computed?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="attributeId"
                  titleGetter={(it) => it.description}
                  label={t('sharedComputedAttributes')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/drivers?all=true"
                  endpointLinked={`/api/drivers?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="driverId"
                  label={t('sharedDrivers')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/commands?all=true"
                  endpointLinked={`/api/commands?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="commandId"
                  titleGetter={(it) => it.description}
                  label={t('sharedSavedCommands')}
                  variant="filled"
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/maintenance?all=true"
                  endpointLinked={`/api/maintenance?userId=${item.id}`}
                  baseId={item.id}
                  keyBase="userId"
                  keyLink="maintenanceId"
                  label={t('sharedMaintenance')}
                  variant="filled"
                />
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </EditItemView>
  );
};

export default UserPage;
