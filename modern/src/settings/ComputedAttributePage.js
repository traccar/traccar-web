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
  Button,
  Snackbar,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditItemView from './components/EditItemView';
import { useTranslation } from '../common/components/LocalizationProvider';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import SettingsMenu from './components/SettingsMenu';
import SelectField from '../common/components/SelectField';
import { useCatch } from '../reactHelper';
import { snackBarDurationLongMs } from '../common/util/duration';

const allowedProperties = ['valid', 'latitude', 'longitude', 'altitude', 'speed', 'course', 'address', 'accuracy'];

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
  const [deviceId, setDeviceId] = useState();
  const [result, setResult] = useState();

  const options = Object.entries(positionAttributes).filter(([key, value]) => !value.property || allowedProperties.includes(key)).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  }));

  const filter = createFilterOptions({
    stringify: (option) => option.name,
  });

  const testAttribute = useCatch(async () => {
    const query = new URLSearchParams({ deviceId });
    const url = `/api/attributes/computed/test?${query.toString()}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (response.ok) {
      setResult(await response.text());
    } else {
      throw Error(await response.text());
    }
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
        <>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedRequired')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <TextField
                value={item.description || ''}
                onChange={(e) => setItem({ ...item, description: e.target.value })}
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
                onChange={(e) => setItem({ ...item, expression: e.target.value })}
                label={t('sharedExpression')}
                multiline
                rows={4}
              />
              <FormControl disabled={item.attribute in positionAttributes}>
                <InputLabel>{t('sharedType')}</InputLabel>
                <Select
                  label={t('sharedType')}
                  value={item.type || ''}
                  onChange={(e) => setItem({ ...item, type: e.target.value })}
                >
                  <MenuItem value="string">{t('sharedTypeString')}</MenuItem>
                  <MenuItem value="number">{t('sharedTypeNumber')}</MenuItem>
                  <MenuItem value="boolean">{t('sharedTypeBoolean')}</MenuItem>
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                {t('sharedTest')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
              <SelectField
                value={deviceId || 0}
                onChange={(e) => setDeviceId(Number(e.target.value))}
                endpoint="/api/devices"
                label={t('sharedDevice')}
              />
              <Button
                variant="outlined"
                color="primary"
                onClick={testAttribute}
                disabled={!deviceId}
              >
                {t('sharedTestExpression')}
              </Button>
              <Snackbar
                open={!!result}
                onClose={() => setResult(null)}
                autoHideDuration={snackBarDurationLongMs}
                message={result}
              />
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </EditItemView>
  );
};

export default ComputedAttributePage;
