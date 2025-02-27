import React, { useState, useMemo } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField, Autocomplete,
} from '@mui/material';

import { createFilterOptions } from '@mui/material/useAutocomplete';
import { makeStyles } from '@mui/styles';
import { useTranslation } from '../../common/components/LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(3),
  },
}));

const AddAttributeDialog = ({ open, onResult, definitions }) => {
  const classes = useStyles();
  const t = useTranslation();

  const filter = createFilterOptions({
    stringify: (option) => option.name,
  });

  const options = useMemo(() => Object.entries(definitions).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  })).sort((a, b) => a.name.localeCompare(b.name)), [definitions]);

  const [key, setKey] = useState();
  const [type, setType] = useState('string');

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogContent className={classes.details}>
        <Autocomplete
          onChange={(_, option) => {
            setKey(option && typeof option === 'object' ? option.key : option);
            if (option && option.type) {
              setType(option.type);
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
          getOptionLabel={(option) => (option && typeof option === 'object' ? option.name : option)}
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
        <FormControl
          fullWidth
          disabled={key in definitions}
        >
          <InputLabel>{t('sharedType')}</InputLabel>
          <Select
            label={t('sharedType')}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="string">{t('sharedTypeString')}</MenuItem>
            <MenuItem value="number">{t('sharedTypeNumber')}</MenuItem>
            <MenuItem value="boolean">{t('sharedTypeBoolean')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={!key}
          onClick={() => onResult({ key, type })}
        >
          {t('sharedAdd')}
        </Button>
        <Button
          autoFocus
          onClick={() => onResult(null)}
        >
          {t('sharedCancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAttributeDialog;
