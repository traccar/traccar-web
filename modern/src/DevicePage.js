import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';
import EditItemView from './EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from './attributes/EditAttributesView';
import deviceAttributes from './attributes/deviceAttributes';
import SelectField from './form/SelectField';
import { deviceCategories } from './common/deviceCategories';
import LinkField from './form/LinkField';
import { prefixString } from './common/stringUtils';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const DevicePage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  return (
    <EditItemView endpoint="devices" item={item} setItem={setItem}>
      {item &&
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
                onChange={event => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
                variant="filled" />
              <TextField
                margin="normal"
                value={item.uniqueId || ''}
                onChange={event => setItem({...item, uniqueId: event.target.value})}
                label={t('deviceIdentifier')}
                variant="filled" />
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
                onChange={event => setItem({...item, groupId: Number(event.target.value)})}
                endpoint="/api/groups"
                label={t('groupParent')}
                variant="filled" />
              <TextField
                margin="normal"
                value={item.phone || ''}
                onChange={event => setItem({...item, phone: event.target.value})}
                label={t('sharedPhone')}
                variant="filled" />
              <TextField
                margin="normal"
                value={item.model || ''}
                onChange={event => setItem({...item, model: event.target.value})}
                label={t('deviceModel')}
                variant="filled" />
              <TextField
                margin="normal"
                value={item.contact || ''}
                onChange={event => setItem({...item, contact: event.target.value})}
                label={t('deviceContact')}
                variant="filled" />
              <SelectField
                margin="normal"
                value={item.category || 'default'}
                emptyValue={null}
                onChange={event => setItem({...item, category: event.target.value})}
                data={deviceCategories.map(category => ({
                  id: category,
                  name: t(`category${category.replace(/^\w/, c => c.toUpperCase())}`)
                }))}
                label={t('deviceCategory')}
                variant="filled" />
              <FormControlLabel
                control={<Checkbox checked={item.disabled} onChange={event => setItem({...item, disabled: event.target.checked})} />}
                label={t('sharedDisabled')} />
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
                setAttributes={attributes => setItem({...item, attributes})}
                definitions={deviceAttributes}
                />
            </AccordionDetails>
          </Accordion>
          {item.id &&
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
                  endpointLinked={"/api/geofences?deviceId=" + item.id}
                  baseId={item.id}
                  keyBase="deviceId"
                  keyLink="geofenceId"
                  label={t('sharedGeofences')}
                  variant="filled" />
                <LinkField
                  margin="normal"
                  endpointAll="/api/notifications"
                  endpointLinked={"/api/notifications?deviceId=" + item.id}
                  baseId={item.id}
                  keyBase="deviceId"
                  keyLink="notificationId"
                  titleGetter={it => t(prefixString('event', it.type))}
                  label={t('sharedNotifications')}
                  variant="filled" />
              </AccordionDetails>
            </Accordion>
          }
        </>
      }
    </EditItemView>
  );
}

export default DevicePage;
