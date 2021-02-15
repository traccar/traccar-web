import React, { useState } from 'react';
import t from '../common/localization';
import { prefixString } from '../common/stringUtils';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, TextField, FormControl, InputLabel, MenuItem, Select, } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from '../attributes/EditAttributesView';
import positionAttributes from '../attributes/positionAttributes';
import { useAttributePreference } from '../common/preferences';
import { speedFromKnots, speedToKnots, distanceFromMeters, distanceToMeters } from '../common/converter';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const MaintenancePage = () => {
  
  const classes = useStyles();
  const [item, setItem] = useState();
  const [labels, setLabels] = useState({start: '', period: ''});

  const speedUnit = useAttributePreference('speedUnit');
  const distanceUnit = useAttributePreference('distanceUnit');

  const convertToList = (attributes) => {
    let otherList = [];
    for (const key in attributes) {
      const value = attributes[key];
      if (value.type === 'number') {
        otherList.push({key, name: value.name, type: value.type});
      }
    }
    return otherList;
  }

  const onMaintenanceTypeChange = event => {
    const newValue = event.target.value;
    setItem({ ...item, type: newValue, start: 0, period: 0 });

    const attribute = positionAttributes[newValue];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'distance':
          setLabels({ ...labels, start: t(prefixString('shared', distanceUnit)), period: t(prefixString('shared', distanceUnit))});
          break;
        case 'speed':
          setLabels({ ...labels, start: t(prefixString('shared', speedUnit)), period: t(prefixString('shared', speedUnit))});
          break;
        default:
          break;
      }
    }
  }

  const rawToValue = value => {

    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedFromKnots(value, speedUnit);
        case 'distance':
          return distanceFromMeters(value, distanceUnit);
      }
    }
    return value;
  }

  const valueToRaw = value => {

    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedToKnots(value, speedUnit);
        case 'distance':
          return distanceToMeters(value, distanceUnit);
      }
    }
    return value;
  }

  return (
    <EditItemView endpoint="maintenance" item={item} setItem={setItem}>
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
              <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel>{t('sharedType')}</InputLabel>
                <Select 
                  value={item.type || ''} 
                  onChange={onMaintenanceTypeChange}>
                    {convertToList(positionAttributes).map(({ key, name })=>(
                      <MenuItem key={key} value={key}>{name}</MenuItem>
                    ))}
                </Select>
              </FormControl>            
              <TextField
                margin="normal"
                type="number"
                value={rawToValue(item.start) || ''}
                onChange={event => setItem({...item, start: valueToRaw(event.target.value)})}
                label={t('maintenanceStart')}
                variant="filled"
                InputProps={{
                endAdornment: <InputAdornment position="start">{labels.start}</InputAdornment>,
                }} />
              <TextField
                margin="normal"
                type="number"
                value={rawToValue(item.period) || ''}
                onChange={event => setItem({...item, period: valueToRaw(event.target.value)})}
                label={t('maintenancePeriod')}
                variant="filled"
                InputProps={{
                endAdornment: <InputAdornment position="start">{labels.period}</InputAdornment>,
                }} />                              
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
                definitions={{}}
                />
            </AccordionDetails>
          </Accordion>          
        </>
      }
    </EditItemView>
  );
}

export default MaintenancePage;
