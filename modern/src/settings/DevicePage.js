import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import EditAttributesView from './components/EditAttributesView';
import SelectField from '../common/components/SelectField';
import deviceCategories from '../common/util/deviceCategories';
import LinkField from '../common/components/LinkField';
import { prefixString } from '../common/util/stringUtils';
import { useTranslation } from '../common/components/LocalizationProvider';
import useDeviceAttributes from '../common/attributes/useDeviceAttributes';
import { useAdministrator } from '../common/util/permissions';
import SettingsMenu from './components/SettingsMenu';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useFeatures from '../common/util/useFeatures';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const DevicePage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const admin = useAdministrator();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const deviceAttributes = useDeviceAttributes(t);

  const features = useFeatures();

  const [item, setItem] = useState();

  const validate = () => item && item.name && item.uniqueId;

  return (
    <EditItemView
      endpoint="devices"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['sharedDevice']}
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
              <TextField
                value={item.uniqueId || ''}
                onChange={(event) => setItem({ ...item, uniqueId: event.target.value })}
                label={t('deviceIdentifier')}
              />
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
                value={item.groupId || 0}
                onChange={(event) => setItem({ ...item, groupId: Number(event.target.value) })}
                endpoint="/api/groups"
                label={t('groupParent')}
              />
              <TextField
                value={item.phone || ''}
                onChange={(event) => setItem({ ...item, phone: event.target.value })}
                label={t('sharedPhone')}
              />
              <TextField
                value={item.model || ''}
                onChange={(event) => setItem({ ...item, model: event.target.value })}
                label={t('deviceModel')}
              />
              <TextField
                value={item.contact || ''}
                onChange={(event) => setItem({ ...item, contact: event.target.value })}
                label={t('deviceContact')}
              />
              <SelectField
                value={item.category || 'default'}
                emptyValue={null}
                onChange={(event) => setItem({ ...item, category: event.target.value })}
                data={deviceCategories.map((category) => ({
                  id: category,
                  name: t(`category${category.replace(/^\w/, (c) => c.toUpperCase())}`),
                }))}
                label={t('deviceCategory')}
              />
              {admin && (
                <FormControlLabel
                  control={<Checkbox checked={item.disabled} onChange={(event) => setItem({ ...item, disabled: event.target.checked })} />}
                  label={t('sharedDisabled')}
                />
              )}
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
                definitions={{ ...commonDeviceAttributes, ...deviceAttributes }}
              />
            </AccordionDetails>
          </Accordion>
          {item.id && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">
                  {t('sharedConnections')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className={classes.details}>
                <LinkField
                  endpointAll="/api/geofences"
                  endpointLinked={`/api/geofences?deviceId=${item.id}`}
                  baseId={item.id}
                  keyBase="deviceId"
                  keyLink="geofenceId"
                  label={t('sharedGeofences')}
                />
                <LinkField
                  endpointAll="/api/notifications"
                  endpointLinked={`/api/notifications?deviceId=${item.id}`}
                  baseId={item.id}
                  keyBase="deviceId"
                  keyLink="notificationId"
                  titleGetter={(it) => t(prefixString('event', it.type))}
                  label={t('sharedNotifications')}
                />
                {!features.disableDrivers && (
                  <LinkField
                    endpointAll="/api/drivers"
                    endpointLinked={`/api/drivers?deviceId=${item.id}`}
                    baseId={item.id}
                    keyBase="deviceId"
                    keyLink="driverId"
                    label={t('sharedDrivers')}
                  />
                )}
                {!features.disableComputedAttributes && (
                  <LinkField
                    endpointAll="/api/attributes/computed"
                    endpointLinked={`/api/attributes/computed?deviceId=${item.id}`}
                    baseId={item.id}
                    keyBase="deviceId"
                    keyLink="attributeId"
                    titleGetter={(it) => it.description}
                    label={t('sharedComputedAttributes')}
                  />
                )}
                <LinkField
                  endpointAll="/api/commands"
                  endpointLinked={`/api/commands?deviceId=${item.id}`}
                  baseId={item.id}
                  keyBase="deviceId"
                  keyLink="commandId"
                  titleGetter={(it) => it.description}
                  label={t('sharedSavedCommands')}
                />
                {!features.disableMaintenance && (
                  <LinkField
                    endpointAll="/api/maintenance"
                    endpointLinked={`/api/maintenance?deviceId=${item.id}`}
                    baseId={item.id}
                    keyBase="deviceId"
                    keyLink="maintenanceId"
                    label={t('sharedMaintenance')}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </EditItemView>
  );
};

export default DevicePage;
