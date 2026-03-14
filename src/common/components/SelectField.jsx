import { useEffect, useState } from 'react';
import { MenuItem, Autocomplete, TextField, Chip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useEffectAsync } from '../../reactHelper';
import fetchOrThrow from '../util/fetchOrThrow';

const useStyles = makeStyles()(() => ({
  autocompleteMultiple: {
    '& .MuiAutocomplete-inputRoot': {
      flexWrap: 'nowrap',
      overflow: 'hidden',
    },
    '& .MuiAutocomplete-input': {
      minWidth: '1px !important',
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
  singleLine,
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
        size={singleLine ? 'small' : 'medium'}
        multiple={multiple}
        className={multiple && singleLine ? classes.autocompleteMultiple : undefined}
        options={items}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => (
          <MenuItem {...props} key={keyGetter(option)} value={keyGetter(option)}>
            {titleGetter(option)}
          </MenuItem>
        )}
        isOptionEqualToValue={(option, selectedOption) =>
          keyGetter(option) === keyGetter(selectedOption)
        }
        value={autocompleteValue}
        onChange={(_, selectedValue) => {
          if (multiple) {
            onChange({ target: { value: selectedValue.map((item) => keyGetter(item)) } });
          } else {
            onChange({ target: { value: selectedValue ? keyGetter(selectedValue) : emptyValue } });
          }
        }}
        renderValue={
          multiple && singleLine
            ? (tagValue, getItemProps) => {
                if (!tagValue.length) {
                  return null;
                }
                return (
                  <>
                    <Chip
                      {...getItemProps({ index: 0 })}
                      key={keyGetter(tagValue[0])}
                      label={titleGetter(tagValue[0])}
                      size="small"
                      sx={{ minWidth: 0 }}
                    />
                    {tagValue.length > 1 && (
                      <Chip label={`${tagValue.length - 1}`} size="small" sx={{ flexShrink: 0 }} />
                    )}
                  </>
                );
              }
            : undefined
        }
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
                shrink:
                  (multiple && !autocompleteValue.length && Boolean(placeholder)) ||
                  params.InputLabelProps?.shrink,
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
