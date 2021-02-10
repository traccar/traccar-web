import React, { useState } from 'react';
import t from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, TextField, FormControl, InputLabel, MenuItem, Select, } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from '../attributes/EditAttributesView';
import positionAttributes from '../attributes/positionAttributes';
import { useAttributePreference } from '../common/preferences';
import { distanceConverter, speedConverter } from '../common/converter';

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

  const options = [];

  Object.entries(positionAttributes).map(([key, value]) => {
    if (value.type === 'number') {
      options.push({key, name: value.name, type: value.type})
    }
  });

  const handleChange = event => {
    const newValue = event.target.value;
    setItem({...item, type: newValue, start: 0, period: 0});

    const attribute = positionAttributes[newValue];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'distance':
          setLabels({ ...labels, start: distanceUnit, period: distanceUnit});
          break;
        case 'speed':
          setLabels({ ...labels, start: speedUnit, period: speedUnit});
          break;
        default:
          break;
      }
    }
  }

  const rawToValue = (rawValue) => {

    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedConverter(rawValue, speedUnit, false);
        case 'distance':
          return distanceConverter(rawValue, distanceUnit, false);
        default:
          return rawValue;
      }
    }

    return rawValue;

  }

  const valueToRaw = (value) => {

    const attribute = positionAttributes[item.type];
    if (attribute && attribute.dataType) {
      switch (attribute.dataType) {
        case 'speed':
          return speedConverter(value, speedUnit, true);
        case 'distance':
          return distanceConverter(value, distanceUnit, true);
        default:
          return value;
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
                  onChange={handleChange}>
                  {options.map((option) => (
                    <MenuItem key={option.key} value={option.key}>{option.name}</MenuItem>
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
