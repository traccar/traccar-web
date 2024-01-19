import {
  FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField
} from '@mui/material';
import React, { useState } from 'react';
import { useEffectAsync } from '../../reactHelper';

const SelectField = ({
  label,
  fullWidth,
  multiple,
  value,
  emptyValue = 0,
  emptyTitle = '\u00a0',
  onChange,
  endpoint,
  data,
  keyField = 'id',
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [items, setItems] = useState(data);

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
          <>
            <Autocomplete
              size="small"
              options={items}
              getOptionLabel={(option) => {
                                      if (typeof option != 'object') {
                                        if (keyField) {
                                          option = items.find(obj => obj[keyField] === option)
                                        } else {
                                          option = items.find(obj => obj === option)
                                        }
                                      }
                                      const title = option ? titleGetter(option) : ''
                                      return title ? title : ''
                                      }
                              }
              renderOption={(props, option) => (
                <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>{titleGetter(option)}</MenuItem>
              )}
              isOptionEqualToValue={(option, value) => keyGetter(option) == value}
              value={value}
              onChange={(e, nV) => {onChange({target:{value:nV ? keyGetter(nV) : emptyValue}})}}
              renderInput={(params) => <TextField {...params} label={label} />}
            />
          </>
        )}
      </FormControl>
    );
  }
  return null;
};

export default SelectField;
