import React, { useState } from 'react';

import t, { findStringKeys } from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { prefixString, unprefixString } from '../common/stringUtils';
import SelectField from '../form/SelectField';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const NotificationPage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  const alarms = findStringKeys(it => it.startsWith('alarm')).map(it => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  return (
    <EditItemView endpoint="notifications" item={item} setItem={setItem}>
      {item &&
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                margin="normal"
                value={item.type || 'alarm'}
                emptyValue={null}
                onChange={e => setItem({...item, type: e.target.value})}
                endpoint="/api/notifications/types"
                keyGetter={it => it.type}
                titleGetter={it => t(prefixString('event', it.type))}
                label={t('sharedType')}
                variant="filled" />
              <SelectField
                multiple
                margin="normal"
                value={item.notificators ? item.notificators.split(/[, ]+/) : []}
                onChange={e => setItem({...item, notificators: e.target.value.join()})}
                endpoint="/api/notifications/notificators"
                keyGetter={it => it.type}
                titleGetter={it => t(prefixString('notificator', it.type))}
                label={t('notificationNotificators')}
                variant="filled" />
              {(!item.type || item.type === 'alarm') &&
                <SelectField
                  multiple
                  margin="normal"
                  value={item.attributes && item.attributes.alarms ? item.attributes.alarms.split(/[, ]+/) : []}
                  onChange={e => setItem({...item, attributes: {...item.attributes, alarms: e.target.value.join()}})}
                  data={alarms}
                  keyGetter={it => it.key}
                  label={t('sharedAlarms')}
                  variant="filled" />
              }
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.always}
                    onChange={event => setItem({...item, always: event.target.checked})}
                    />
                }
                label={t('notificationAlways')} />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default NotificationPage;
