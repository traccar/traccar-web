import { useEffect, useState } from 'react';
import {
  MenuItem,
  Autocomplete,
  TextField,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useEffectAsync } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()((theme) => ({
  autocompleteMultiple: {
    '& .MuiAutocomplete-inputRoot': {
      flexWrap: 'nowrap',
      overflow: 'hidden',
    },
    '& .MuiAutocomplete-clearIndicator, & .MuiAutocomplete-popupIndicator': {
      backgroundColor: theme.palette.background.paper,
    },
    '& .MuiAutocomplete-tag .MuiChip-label': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
}));

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
  const { classes } = useStyles();
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
        limitTags={multiple ? 1 : -1}
        className={multiple ? classes.autocompleteMultiple : undefined}
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
