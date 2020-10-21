import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";

import t from '../common/localization';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';

const AddAttributeDialog = ({ open, onResult, definitions }) => {
  const filter = createFilterOptions({
    stringify: option => option.name,
  });

  const options = Object.entries(definitions).map(([key, value]) => ({
    key,
    name: value.name,
    type: value.type,
  }));

  const [key, setKey] = useState();
  const [type, setType] = useState('string');

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogContent>
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
          getOptionLabel={option => {
            return option && typeof option === 'object' ? option.name : option;
          }}
          renderOption={option => option.name}
          freeSolo
          renderInput={(params) => (
            <TextField {...params} label={t('sharedAttribute')} variant="filled" margin="normal" />
          )}
        />
        <FormControl
          variant="filled"
          margin="normal"
          fullWidth
          disabled={key in definitions}>
          <InputLabel>{t('sharedType')}</InputLabel>
          <Select
            value={type}
            onChange={e => setType(e.target.value)}>
            <MenuItem value={'string'}>{t('sharedTypeString')}</MenuItem>
            <MenuItem value={'number'}>{t('sharedTypeNumber')}</MenuItem>
            <MenuItem value={'boolean'}>{t('sharedTypeBoolean')}</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={!key}
          onClick={() => onResult({ key, type })}>
          {t('sharedAdd')}
        </Button>
        <Button
          autoFocus
          onClick={() => onResult(null)}>
          {t('sharedCancel')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAttributeDialog;
