import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, makeStyles, Typography,  FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import t from '../common/localization';
import EditItemView from '../EditItemView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import positionAttributes from '../attributes/positionAttributes';


const useStyles = makeStyles(() => ({
  details: {
    flexDirection: 'column',
  },
}));

const ComputedAttributePage =() => {

  const classes = useStyles();
  const [item, setItem] = useState();
  const [key, setKey] = useState();

  const options = Object.entries(positionAttributes).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  }));

  const handleChange = event => {
    const newValue = event.target.value;
    setKey(newValue);
    const positionAttribute = positionAttributes[newValue];
    if(positionAttribute && positionAttribute.type) {
      setItem({...item, attribute: newValue, type: positionAttribute.type});
    } else {
      setItem({...item, attribute: newValue});
    }
  }

  return (
    <EditItemView endpoint="/attributes/computed" item={item} setItem={setItem}>
      {item &&
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              margin="normal"
              value={item.description || ''}
              onChange={event => setItem({...item, description: event.target.value})}
              label={t('sharedDescription')}
              variant="filled" />
            <FormControl variant="filled" margin="normal" fullWidth>
              <InputLabel>{t('sharedAttribute')}</InputLabel>
              <Select 
                value={item.attribute || ''} 
                onChange={handleChange}>
                {options.map((option) => (
                  <MenuItem key={option.key} value={option.key}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>            
            <TextField
              margin="normal"
              value={item.expression || ''}
              onChange={event => setItem({...item, expression: event.target.value})}
              label={t('sharedExpression')}
              multiline
              rows={4}
              variant="filled" />
            <FormControl
              variant="filled"
              margin="normal"
              fullWidth
              disabled={key in positionAttributes}>
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select
                value={item.type || ''}
                onChange={event => setItem({...item, type: event.target.value})}>
                <MenuItem value={'string'}>{t('sharedTypeString')}</MenuItem>
                <MenuItem value={'number'}>{t('sharedTypeNumber')}</MenuItem>
                <MenuItem value={'boolean'}>{t('sharedTypeBoolean')}</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      }
    </EditItemView>
  )
}

export default ComputedAttributePage;
