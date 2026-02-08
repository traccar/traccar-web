import { useEffect, useState } from 'react';
import {
  MenuItem,
  Autocomplete,
  TextField,
  Chip,
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
  helperText,
  placeholder,
}) => {
  const [items, setItems] = useState();

  const findOption = (option) => {
    if (typeof option === 'object') {
      return option;
    }
    return items.find((obj) => keyGetter(obj) === option);
  };

  const getOptionLabel = (option) => {
    option = findOption(option);
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
    const autocompleteValue = multiple
      ? (value || []).map((it) => findOption(it)).filter((it) => it != null)
      : findOption(value) || null;

    return (
      <Autocomplete
        size="small"
        multiple={multiple}
        options={items}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => (
          <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>{titleGetter(option)}</MenuItem>
        )}
        isOptionEqualToValue={(option, selectedOption) => keyGetter(option) === keyGetter(selectedOption)}
        value={autocompleteValue}
        onChange={(_, selectedValue) => {
          if (multiple) {
            onChange({ target: { value: selectedValue.map((item) => keyGetter(item)) } });
          } else {
            onChange({ target: { value: selectedValue ? keyGetter(selectedValue) : emptyValue } });
          }
        }}
        fullWidth={fullWidth}
        disableCloseOnSelect={multiple}
        renderValue={multiple ? (selectedOptions, getItemProps) => (
          selectedOptions.length ? (
            <>
              <Chip
                {...getItemProps({ index: 0 })}
                key={keyGetter(selectedOptions[0])}
                label={titleGetter(selectedOptions[0])}
                size="small"
              />
              {selectedOptions.length > 1 && <Chip label={`+${selectedOptions.length - 1}`} size="small" />}
            </>
          ) : null
        ) : undefined}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            helperText={helperText}
            placeholder={multiple && !autocompleteValue.length ? placeholder : undefined}
            slotProps={{
              inputLabel: {
                ...params.InputLabelProps,
                shrink: multiple && !autocompleteValue.length && Boolean(placeholder) || params.InputLabelProps?.shrink,
              },
            }}
          />
        )}
      />
    );
  }
  return null;
};

export default SelectField;
