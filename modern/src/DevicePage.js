import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';
import EditItemView from './EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControl, InputLabel, Select, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useEffectAsync } from './reactHelper';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const deviceCategories = [
  'default',
  'animal',
  'bicycle',
  'boat',
  'bus',
  'car',
  'crane',
  'helicopter',
  'motorcycle',
  'offroad',
  'person',
  'pickup',
  'plane',
  'ship',
  'tractor',
  'train',
  'tram',
  'trolleybus',
  'truck',
  'van',
  'scooter',
];

const DevicePage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();
  const [groups, setGroups] = useState();

  useEffectAsync(async () => {
    const response = await fetch('/api/groups');
    if (response.ok) {
      setGroups(await response.json());
    }
  }, []);

  return (
    <EditItemView endpoint="devices" setItem={setItem} getItem={() => item}>
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
                defaultValue={item.name}
                onChange={event => setItem({...item, name: event.target.value})}
                label={t('sharedName')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.uniqueId}
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
              {groups &&
                <FormControl margin="normal" variant="filled">
                  <InputLabel>{t('groupParent')}</InputLabel>
                  <Select
                    native
                    defaultValue={item.groupId}
                    onChange={event => setItem({...item, groupId: Number(event.target.value)})}>
                    <option value={0}></option>
                    {groups.map(group => (
                      <option value={group.id}>{group.name}</option>
                    ))}
                  </Select>
                </FormControl>
              }
              <TextField
                margin="normal"
                defaultValue={item.phone}
                onChange={event => setItem({...item, phone: event.target.value})}
                label={t('sharedPhone')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.model}
                onChange={event => setItem({...item, model: event.target.value})}
                label={t('deviceModel')}
                variant="filled" />
              <TextField
                margin="normal"
                defaultValue={item.contact}
                onChange={event => setItem({...item, contact: event.target.value})}
                label={t('deviceContact')}
                variant="filled" />
              <FormControl margin="normal" variant="filled">
                <InputLabel>{t('deviceCategory')}</InputLabel>
                <Select
                  native
                  defaultValue={item.category}
                  onChange={event => setItem({...item, category: event.target.value})}>
                  {deviceCategories.map(category => (
                    <option value={category}>{t(`category${category.replace(/^\w/, c => c.toUpperCase())}`)}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={item.disabled} onChange={event => setItem({...item, disabled: event.target.checked})} />}
                label={t('sharedDisabled')} />
            </AccordionDetails>
          </Accordion>
        </>
      }
    </EditItemView>
  );
}

export default DevicePage;
