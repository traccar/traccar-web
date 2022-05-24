import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import { useTranslation } from '../common/components/LocalizationProvider';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import SettingsMenu from './components/SettingsMenu';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(3),
  },
}));

const ComputedAttributePage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const positionAttributes = usePositionAttributes(t);

  const [item, setItem] = useState();
  const [key, setKey] = useState();

  const options = Object.entries(positionAttributes).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  }));

  const handleChange = (event) => {
    const newValue = event.target.value;
    setKey(newValue);
    const positionAttribute = positionAttributes[newValue];
    if (positionAttribute && positionAttribute.type) {
      setItem({ ...item, attribute: newValue, type: positionAttribute.type });
    } else {
      setItem({ ...item, attribute: newValue });
    }
  };

  const validate = () => item && item.description && item.expression;

  return (
    <EditItemView
      endpoint="attributes/computed"
      item={item}
      setItem={setItem}
      validate={validate}
      menu={<SettingsMenu />}
      breadcrumbs={['settingsTitle', 'sharedComputedAttribute']}
    >
      {item && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">
              {t('sharedRequired')}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.details}>
            <TextField
              value={item.description || ''}
              onChange={(event) => setItem({ ...item, description: event.target.value })}
              label={t('sharedDescription')}
            />
            <FormControl>
              <InputLabel>{t('sharedAttribute')}</InputLabel>
              <Select
                label={t('sharedAttribute')}
                value={item.attribute || ''}
                onChange={handleChange}
              >
                {options.map((option) => (
                  <MenuItem key={option.key} value={option.key}>{option.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              value={item.expression || ''}
              onChange={(event) => setItem({ ...item, expression: event.target.value })}
              label={t('sharedExpression')}
              multiline
              rows={4}
            />
            <FormControl disabled={key in positionAttributes}>
              <InputLabel>{t('sharedType')}</InputLabel>
              <Select
                label={t('sharedType')}
                value={item.type || ''}
                onChange={(event) => setItem({ ...item, type: event.target.value })}
              >
                <MenuItem value="string">{t('sharedTypeString')}</MenuItem>
                <MenuItem value="number">{t('sharedTypeNumber')}</MenuItem>
                <MenuItem value="boolean">{t('sharedTypeBoolean')}</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      )}
    </EditItemView>
  );
};

export default ComputedAttributePage;
