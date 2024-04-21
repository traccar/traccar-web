import {
<<<<<<< HEAD:src/common/components/SelectField.jsx
  FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField,
=======
  FormControl, InputLabel, MenuItem, Select,
>>>>>>> master:modern/src/common/components/SelectField.jsx
} from '@mui/material';
import React, { useState } from 'react';
import { useEffectAsync } from '../../reactHelper';

const SelectField = ({
  label,
  fullWidth,
  multiple,
<<<<<<< HEAD:src/common/components/SelectField.jsx
  value = null,
  emptyValue = null,
  emptyTitle = '',
=======
  value,
  emptyValue = 0,
  emptyTitle = '\u00a0',
>>>>>>> master:modern/src/common/components/SelectField.jsx
  onChange,
  endpoint,
  data,
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [items, setItems] = useState(data);

<<<<<<< HEAD:src/common/components/SelectField.jsx
  const getOptionLabel = (option) => {
    if (typeof option !== 'object') {
      option = items.find((obj) => keyGetter(obj) === option);
    }
    return option ? titleGetter(option) : emptyTitle;
  };

=======
>>>>>>> master:modern/src/common/components/SelectField.jsx
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
<<<<<<< HEAD:src/common/components/SelectField.jsx
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
=======
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          multiple={multiple}
          value={value}
          onChange={onChange}
        >
          {!multiple && emptyValue !== null && (
            <MenuItem value={emptyValue}>{emptyTitle}</MenuItem>
          )}
          {items.map((item) => (
            <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
          ))}
        </Select>
>>>>>>> master:modern/src/common/components/SelectField.jsx
      </FormControl>
    );
  }
  return null;
};

export default SelectField;
