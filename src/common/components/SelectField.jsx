import React, { useEffect, useState } from 'react';
import {
  FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField,
} from '@mui/material';
import { useEffectAsync } from '../../reactHelper';

const SelectField = ({
  label,
  fullWidth,
  multiple,
  value = null,
  emptyValue = null,
  emptyTitle = '',
  onChange,
  endpoint,
  data,
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [items, setItems] = useState();

  const getOptionLabel = (option) => {
    if (typeof option !== 'object') {
      option = items.find((obj) => keyGetter(obj) === option);
    }
    return option ? titleGetter(option) : emptyTitle;
  };

  useEffect(() => setItems(data), [data]);

  useEffectAsync(async () => {
    if (endpoint) {
      const response = await fetch(endpoint);
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    }
  }, []);

  if (items) {
    return (
      <FormControl fullWidth={fullWidth}>
        {multiple ? (
          <>
            <InputLabel>{label}</InputLabel>
            <Select
              label={label}
              multiple
              value={value}
              onChange={onChange}
            >
              {items.map((item) => (
                <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <Autocomplete
            size="small"
            options={items}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => (
              <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>{titleGetter(option)}</MenuItem>
            )}
            isOptionEqualToValue={(option, value) => keyGetter(option) === value}
            value={value}
            onChange={(_, value) => onChange({ target: { value: value ? keyGetter(value) : emptyValue } })}
            renderInput={(params) => <TextField {...params} label={label} />}
          />
        )}
      </FormControl>
    );
  }
  return null;
};

export default SelectField;
