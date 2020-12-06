import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';

const SelectField = ({
  margin,
  variant,
  label,
  multiple,
  value,
  emptyValue = 0,
  onChange,
  endpoint,
  data,
  keyGetter = item => item.id,
  titleGetter = item => item.name,
}) => {
  const [items, setItems] = useState(data);

  useEffectAsync(async () => {
    if (endpoint) {
      const response = await fetch(endpoint);
      if (response.ok) {
        setItems(await response.json());
      }
    }
  }, []);

  if (items) {
    return (
      <FormControl margin={margin} variant={variant}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple={multiple}
          value={value}
          onChange={onChange}>
          {!multiple && emptyValue !== null &&
            <MenuItem value={emptyValue}>&nbsp;</MenuItem>
          }
          {items.map(item => (
            <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  } else {
    return null;
  }
}

export default SelectField;
