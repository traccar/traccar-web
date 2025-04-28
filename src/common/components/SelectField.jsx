import React, { useEffect, useState } from 'react';
import { Autocomplete, CircularProgress, FormControl, TextField, } from '@mui/material';
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
  groupBy,
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOptionLabel = (option) => {
    if (typeof option !== 'object') {
      option = items.find((obj) => keyGetter(obj) === option);
    }
    return option ? titleGetter(option) : emptyTitle;
  };

  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);

  useEffectAsync(async () => {
    if (endpoint) {
      setLoading(true);
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw new Error(await response.text());
        }
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const handleChange = (_, newValue) => {
    if (multiple) {
      onChange({ target: { value: newValue.map((item) => keyGetter(item)) } });
    } else {
      onChange({ target: { value: newValue ? keyGetter(newValue) : emptyValue } });
    }
  };

  if (!items.length && !loading) {
    return null;
  }

  return (
    <FormControl fullWidth={fullWidth}>
      <Autocomplete
        size="small"
        multiple={multiple}
        options={items}
        groupBy={groupBy ? groupBy : undefined} // 🔥 Add grouping only if provided
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => keyGetter(option) === (typeof value === 'object' ? keyGetter(value) : value)}
        value={
          multiple
            ? items.filter((item) => value?.includes(keyGetter(item)))
            : items.find((item) => keyGetter(item) === value) || null
        }
        onChange={handleChange}
        loading={loading}
        noOptionsText="No options found"
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20}/> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default SelectField;
