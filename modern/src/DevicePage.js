import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';
import EditItemView from './EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, FormControlLabel, Checkbox } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from './attributes/EditAttributesView';
import deviceAttributes from './attributes/deviceAttributes';
import SelectField from './form/SelectField';

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
              <SelectField
                margin="normal"
                defaultValue={item.groupId}
                onChange={event => setItem({...item, groupId: Number(event.target.value)})}
                endpoint="/api/groups"
                label={t('groupParent')}
                variant="filled" />
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
              <SelectField
                margin="normal"
                defaultValue={item.category}
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
        </>
      }
    </EditItemView>
  );
}

export default DevicePage;
