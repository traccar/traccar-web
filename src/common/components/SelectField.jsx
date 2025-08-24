import { useEffect, useState } from 'react';
import {
  FormControl, InputLabel, MenuItem, Select, Autocomplete, TextField,
} from '@mui/material';
import { useEffectAsync } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

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
  searchable = false, // New prop to enable search for multiple
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
      const response = await fetchOrThrow(endpoint);
      setItems(await response.json());
    }
  }, []);

  if (items) {
    return (
      <FormControl fullWidth={fullWidth}>
        {multiple ? (
          searchable ? (
            // Use Autocomplete for multiple with search
            <Autocomplete
              multiple
              size="small"
              options={items}
              getOptionLabel={(option) => titleGetter(option)}
              renderOption={(props, option) => (
                <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>
                  {titleGetter(option)}
                </MenuItem>
              )}
              isOptionEqualToValue={(option, value) => keyGetter(option) === keyGetter(value)}
              value={items.filter(item => value.includes(keyGetter(item)))}
              onChange={(_, newValue) => {
                const selectedIds = newValue.map(item => keyGetter(item));
                onChange({ target: { value: selectedIds } });
              }}
              renderInput={(params) => (
                <TextField {...params} label={label} placeholder={`Search... (${value.length} selected)`} />
              )}
              slotProps={{
                chip: {
                  style: { display: 'none' }
                }
              }}
              filterOptions={(options, { inputValue }) =>
                options.filter(option =>
                  titleGetter(option).toLowerCase().includes(inputValue.toLowerCase())
                )
              }
              noOptionsText="No results found"
              disableCloseOnSelect
            />
          ) : (
            // Use traditional Select for multiple without search
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
          )
        ) : (
          // Single selection always uses Autocomplete (with search)
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
