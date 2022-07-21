import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import EditAttributesAccordion from './components/EditAttributesAccordion';
import SelectField from '../common/components/SelectField';
import LinkField from '../common/components/LinkField';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useGroupAttributes from '../common/attributes/useGroupAttributes';
import useFeatures from '../common/util/useFeatures';
import { formatNotificationTitle } from '../common/util/formatter';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const GroupPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const groupAttributes = useGroupAttributes(t);

  const features = useFeatures();

  const [item, setItem] = useState();

  const validate = () => item && item.name;

  return (
    <EditItemView
      endpoint="groups"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'groupDialog']}
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
            </AccordionDetails>
          </Accordion>
          <EditAttributesAccordion
            attributes={item.attributes}
            setAttributes={(attributes) => setItem({ ...item, attributes })}
            definitions={{ ...commonDeviceAttributes, ...groupAttributes }}
          />
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
                  endpointLinked={`/api/geofences?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="geofenceId"
                  label={t('sharedGeofences')}
                />
                <LinkField
                  endpointAll="/api/notifications"
                  endpointLinked={`/api/notifications?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="notificationId"
                  titleGetter={(it) => formatNotificationTitle(t, it)}
                  label={t('sharedNotifications')}
                />
                {!features.disableDrivers && (
                  <LinkField
                    endpointAll="/api/drivers"
                    endpointLinked={`/api/drivers?groupId=${item.id}`}
                    baseId={item.id}
                    keyBase="groupId"
                    keyLink="driverId"
                    label={t('sharedDrivers')}
                  />
                )}
                {!features.disableComputedAttributes && (
                  <LinkField
                    endpointAll="/api/attributes/computed"
                    endpointLinked={`/api/attributes/computed?groupId=${item.id}`}
                    baseId={item.id}
                    keyBase="groupId"
                    keyLink="attributeId"
                    titleGetter={(it) => it.description}
                    label={t('sharedComputedAttributes')}
                  />
                )}
                <LinkField
                  endpointAll="/api/commands"
                  endpointLinked={`/api/commands?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="commandId"
                  titleGetter={(it) => it.description}
                  label={t('sharedSavedCommands')}
                />
                {!features.disableMaintenance && (
                  <LinkField
                    endpointAll="/api/maintenance"
                    endpointLinked={`/api/maintenance?groupId=${item.id}`}
                    baseId={item.id}
                    keyBase="groupId"
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

export default GroupPage;
