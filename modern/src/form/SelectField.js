import { FormControl, InputLabel, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';

const SelectField = ({ margin, variant, label, defaultValue, onChange, endpoint }) => {
  const [items, setItems] = useState();

  useEffectAsync(async () => {
    const response = await fetch(endpoint);
    if (response.ok) {
      setItems(await response.json());
    }
  }, []);

  if (items) {
    return (
      <FormControl margin={margin} variant={variant}>
        <InputLabel>{label}</InputLabel>
        <Select
          native
          defaultValue={defaultValue}
          onChange={onChange}>
          <option value={0}></option>
          {items.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </Select>
      </FormControl>
    );
  } else {
    return null;
  }
}

export default SelectField;
