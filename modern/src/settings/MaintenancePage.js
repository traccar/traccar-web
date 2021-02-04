import React, { useState } from 'react';

import t from '../common/localization';
import EditItemView from '../EditItemView';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography, TextField, FormControl, InputLabel, MenuItem, Select, } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditAttributesView from '../attributes/EditAttributesView';
import positionAttributes from '../attributes/positionAttributes';

const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const MaintenancePage = () => {
  const classes = useStyles();

  const [item, setItem] = useState();

  const options = [];

  Object.entries(positionAttributes).map(([key, value]) => {
    if (value.type === 'number') {
      options.push({ key, name: value.name, type: value.type })
    }
  });

  const handleChange = event => {
    const newValue = event.target.value;
    setItem({...item, type: newValue});
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
                value={item.start || ''}
                onChange={event => setItem({...item, start: event.target.value})}
                label={t('maintenanceStart')}
                variant="filled" />
              <TextField
                margin="normal"
                type="number"
                value={item.period || ''}
                onChange={event => setItem({...item, period: event.target.value})}
                label={t('maintenancePeriod')}
                variant="filled" />                
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
