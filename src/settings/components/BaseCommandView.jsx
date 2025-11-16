import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useRestriction } from '../../common/util/permissions';
import { useEffectAsync } from '../../reactHelper';
import fetchOrThrow from '../../common/util/fetchOrThrow';
import { prefixString } from '../../common/util/stringUtils';
import useCommandAttributes from '../../common/attributes/useCommandAttributes';

const BaseCommandView = ({
  deviceId,
  item,
  setItem,
  includeSaved = false,
  savedId,
  setSavedId,
}) => {
  const t = useTranslation();
  const limitCommands = useRestriction('limitCommands');

  const textEnabled = useSelector((state) => state.session.server.textEnabled);

  const availableAttributes = useCommandAttributes(t);

  const [attributes, setAttributes] = useState([]);
  const [options, setOptions] = useState([]);

  useEffectAsync(async () => {
    if (includeSaved) {
      const savedResponse = await fetchOrThrow(`/api/commands/send?deviceId=${deviceId}`);
      const saved = await savedResponse.json();
      let combined = saved.map((it) => ({ ...it, optionType: 'saved', key: `saved-${it.id}` }));
      if (!limitCommands) {
        const typesResponse = await fetchOrThrow(`/api/commands/types?${new URLSearchParams({ deviceId }).toString()}`);
        const types = await typesResponse.json();
        combined = combined.concat(types.map((it) => ({ ...it, optionType: 'type', key: `type-${it.type}` })));
      }
      setOptions(combined);
    } else {
      const typesResponse = await fetchOrThrow('/api/commands/types');
      const types = await typesResponse.json();
      setOptions(types.map((it) => ({ ...it, optionType: 'type', key: `type-${it.type}` })));
    }
  }, [deviceId, includeSaved, limitCommands]);

  useEffect(() => {
    if (item && item.type) {
      setAttributes(availableAttributes[item.type] || []);
    } else {
      setAttributes([]);
    }
  }, [availableAttributes, item]);

  const handleSelect = (_, value) => {
    if (value?.optionType === 'saved') {
      setSavedId?.(value.id);
      setItem({});
    } else if (value?.type) {
      setSavedId?.(0);
      const defaults = {};
      availableAttributes[value.type]?.forEach((attribute) => {
        switch (attribute.type) {
          case 'boolean':
            defaults[attribute.key] = false;
            break;
          case 'number':
            defaults[attribute.key] = 0;
            break;
          default:
            defaults[attribute.key] = '';
            break;
        }
      });
      setItem({ ...item, type: value.type, attributes: defaults });
    }
  };

  return (
    <>
      <Autocomplete
        size="small"
        options={options}
        groupBy={
          includeSaved
            ? (option) => option.optionType === 'saved' ? t('sharedSavedCommands') : t('sharedType')
            : null
        }
        getOptionLabel={(option) =>
          option.optionType === 'saved'
            ? option.description
            : t(prefixString('command', option.type))
        }
        renderOption={(props, option) => (
          <MenuItem {...props} key={option.key} value={option.key}>
            {option.optionType === 'saved'
              ? option.description
              : t(prefixString('command', option.type))}
          </MenuItem>
        )}
        isOptionEqualToValue={(option, value) => option.key === value.key}
        value={
          savedId
            ? options.find((it) => it.optionType === 'saved' && it.id === savedId) || null
            : options.find((it) => it.optionType === 'type' && it.type === item.type) || null
        }
        onChange={handleSelect}
        renderInput={(params) => <TextField {...params} label={t('sharedType')} />}
      />
      {(!includeSaved || !savedId) &&
        attributes.map(({ key, name, type }) => {
          if (type === 'boolean') {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.attributes[key]}
                    onChange={(e) => {
                      const updateItem = { ...item, attributes: { ...item.attributes } };
                      updateItem.attributes[key] = e.target.checked;
                      setItem(updateItem);
                    }}
                  />
                }
                label={name}
              />
            );
          }
          return (
            <TextField
              type={type === 'number' ? 'number' : 'text'}
              value={item.attributes[key]}
              onChange={(e) => {
                const updateItem = { ...item, attributes: { ...item.attributes } };
                updateItem.attributes[key] =
                  type === 'number' ? Number(e.target.value) : e.target.value;
                setItem(updateItem);
              }}
              label={name}
            />
          );
        })}
      {textEnabled && (
        <FormControlLabel
          control={
            <Checkbox
              checked={item.textChannel}
              onChange={(e) => setItem({ ...item, textChannel: e.target.checked })}
            />
          }
          label={t('commandSendSms')}
        />
      )}
      {!item.textChannel && (
        <FormControlLabel
          control={
            <Checkbox
              checked={item.attributes?.noQueue}
              onChange={(e) =>
                setItem({
                  ...item,
                  attributes: { ...item?.attributes, noQueue: e.target.checked },
                })
              }
            />
          }
          label={t('commandNoQueue')}
        />
      )}
    </>
  );
};

export default BaseCommandView;
