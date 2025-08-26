import { useEffect, useState } from 'react';
import {
  FormControl, MenuItem, Autocomplete, TextField,
} from '@mui/material';
import { useEffectAsync } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';
import { useTranslation } from './LocalizationProvider';

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

  const t = useTranslation();

  const getOptionLabel = (option) => {
    if (typeof option !== 'object') {
      option = items.find((obj) => keyGetter(obj) === option);
    }
    return option ? titleGetter(option) : emptyTitle;
  };

  const getPlaceholder = () => {
    if (!multiple || value.length === 0) {
      return t('sharedSearch');
    }
    const selectedTitles = items.filter(item => value.includes(keyGetter(item))).map(item => titleGetter(item)).join(', ');
    return selectedTitles;
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
          <Autocomplete
            multiple={multiple}
            size="small"
            options={items}
            getOptionLabel={getOptionLabel}
            renderOption={(props, option) => (
              <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>{titleGetter(option)}</MenuItem>
            )}
            isOptionEqualToValue={(option, value) => keyGetter(option) === (multiple ? keyGetter(value) : value)}
            value={multiple ? items.filter(item => value.includes(keyGetter(item))) : value}
            onChange={(_, value) => {
              if (multiple) {
                const selectedIds = value.map(item => keyGetter(item));
                onChange({ target: { value: selectedIds } });
              } else {
                onChange({ target: { value: value ? keyGetter(value) : emptyValue } });
              }
            }}
            renderInput={(params) => <TextField {...params} label={label} placeholder={getPlaceholder()}/>}
            disableCloseOnSelect={multiple}
            slotProps={{
              chip: {
                style: { display: 'none' }
              }
            }}
          />
      </FormControl>
    );
  }
  return null;
};

export default SelectField;
