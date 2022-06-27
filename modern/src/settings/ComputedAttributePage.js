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
  createFilterOptions,
  Autocomplete,
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

  const options = Object.entries(positionAttributes).filter(([, value]) => !value.property).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  }));

  const filter = createFilterOptions({
    stringify: (option) => option.name,
  });

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
            <Autocomplete
              value={options.find((option) => option.key === item.attribute) || item.attribute}
              onChange={(_, option) => {
                const attribute = option ? option.key || option : null;
                if (option && option.type) {
                  setItem({ ...item, attribute, type: option.type });
                } else {
                  setItem({ ...item, attribute });
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue) {
                  filtered.push({
                    key: params.inputValue,
                    name: params.inputValue,
                  });
                }
                return filtered;
              }}
              options={options}
              getOptionLabel={(option) => option.name || option}
              renderOption={(props, option) => (
                <li {...props}>
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label={t('sharedAttribute')} />
              )}
              freeSolo
            />
            <TextField
              value={item.expression || ''}
              onChange={(event) => setItem({ ...item, expression: event.target.value })}
              label={t('sharedExpression')}
              multiline
              rows={4}
            />
            <FormControl disabled={item.attribute in positionAttributes}>
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
