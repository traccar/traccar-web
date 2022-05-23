import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

import {
  Accordion, AccordionSummary, AccordionDetails, Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import EditAttributesView from './components/EditAttributesView';
import SelectField from '../common/components/SelectField';
import LinkField from '../common/components/LinkField';
import { useTranslation } from '../common/components/LocalizationProvider';
import SettingsMenu from './components/SettingsMenu';
import useCommonDeviceAttributes from '../common/attributes/useCommonDeviceAttributes';
import useGroupAttributes from '../common/attributes/useGroupAttributes';
import { prefixString } from '../common/util/stringUtils';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const GroupPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const commonDeviceAttributes = useCommonDeviceAttributes(t);
  const groupAttributes = useGroupAttributes(t);

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
                margin="normal"
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
                margin="normal"
                value={item.groupId || 0}
                onChange={(event) => setItem({ ...item, groupId: Number(event.target.value) })}
                endpoint="/api/groups"
                label={t('groupParent')}
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
                definitions={{ ...commonDeviceAttributes, ...groupAttributes }}
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
                  margin="normal"
                  endpointAll="/api/geofences"
                  endpointLinked={`/api/geofences?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="geofenceId"
                  label={t('sharedGeofences')}
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/notifications"
                  endpointLinked={`/api/notifications?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="notificationId"
                  titleGetter={(it) => t(prefixString('event', it.type))}
                  label={t('sharedNotifications')}
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/drivers"
                  endpointLinked={`/api/drivers?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="driverId"
                  label={t('sharedDrivers')}
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/attributes/computed"
                  endpointLinked={`/api/attributes/computed?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="attributeId"
                  titleGetter={(it) => it.description}
                  label={t('sharedComputedAttributes')}
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/commands"
                  endpointLinked={`/api/commands?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="commandId"
                  titleGetter={(it) => it.description}
                  label={t('sharedSavedCommands')}
                />
                <LinkField
                  margin="normal"
                  endpointAll="/api/maintenance"
                  endpointLinked={`/api/maintenance?groupId=${item.id}`}
                  baseId={item.id}
                  keyBase="groupId"
                  keyLink="maintenanceId"
                  label={t('sharedMaintenance')}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </EditItemView>
  );
};

export default GroupPage;
