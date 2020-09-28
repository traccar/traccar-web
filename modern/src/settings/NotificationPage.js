import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t, { findStringKeys } from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffectAsync } from '../reactHelper';
import { prefixString, unprefixString } from '../common/stringUtils';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const NotificationPage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();
  const [types, setTypes] = useState();
  const [notificators, setNotificators] = useState();

  const alarms = findStringKeys(it => it.startsWith('alarm')).map(it => ({
    key: unprefixString('alarm', it),
    name: t(it),
  }));

  useEffectAsync(async () => {
    const response = await fetch('/api/notifications/types');
    if (response.ok) {
      setTypes(await response.json());
    }
  }, []);

  useEffectAsync(async () => {
    const response = await fetch('/api/notifications/notificators');
    if (response.ok) {
      setNotificators(await response.json());
    }
  }, []);

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
              {types &&
                <FormControl margin="normal" variant="filled">
                  <InputLabel>{t('sharedType')}</InputLabel>
                  <Select
                    native
                    defaultValue={item.type}
                    onChange={e => setItem({...item, type: e.target.value})}>
                    {types.map(it => (
                      <option key={it.type} value={it.type}>{t(prefixString('event', it.type))}</option>
                    ))}
                  </Select>
                </FormControl>
              }
              {notificators &&
                <FormControl margin="normal" variant="filled">
                  <InputLabel>{t('notificationNotificators')}</InputLabel>
                  <Select
                    multiple
                    defaultValue={item.notificators ? item.notificators.split(/[, ]+/) : []}
                    onChange={e => setItem({...item, notificators: e.target.value.join()})}>
                    {notificators.map(it => (
                      <MenuItem key={it.type} value={it.type}>{t(prefixString('notificator', it.type))}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
              {item.type === 'alarm' &&
                <FormControl margin="normal" variant="filled">
                  <InputLabel>{t('sharedAlarms')}</InputLabel>
                  <Select
                    multiple
                    defaultValue={item.attributes.alarms ? item.attributes.alarms.split(/[, ]+/) : []}
                    onChange={e => setItem({...item, attributes: {...item.attributes, alarms: e.target.value.join()}})}>
                    {alarms.map(it => (
                      <MenuItem key={it.key} value={it.key}>{it.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
