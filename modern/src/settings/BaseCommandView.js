import React, { useEffect, useState } from 'react';
import {
  TextField, FormControlLabel, Checkbox,
} from '@material-ui/core';
import { useTranslation } from '../LocalizationProvider';
import SelectField from '../form/SelectField';
import { prefixString } from '../common/stringUtils';
import useCommandAttributes from '../attributes/useCommandAttributes';

const BaseCommandView = ({ item, setItem }) => {
  const t = useTranslation();

  const availableAttributes = useCommandAttributes(t);

  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    if (item && item.type) {
      setAttributes(availableAttributes[item.type] || []);
    } else {
      setAttributes([]);
    }
  }, [availableAttributes, item]);

  return (
    <>
      <SelectField
        margin="normal"
        value={item.type || ''}
        onChange={(e) => setItem({ ...item, type: e.target.value, attributes: {} })}
        endpoint="/api/commands/types"
        keyGetter={(it) => it.type}
        titleGetter={(it) => t(prefixString('command', it.type))}
        label={t('sharedType')}
        variant="filled"
      />
      {attributes.map((attribute) => (
        <TextField
          margin="normal"
          value={item.attributes[attribute.key]}
          onChange={(e) => {
            const updateItem = { ...item, attributes: { ...item.attributes } };
            updateItem.attributes[attribute.key] = e.target.value;
            setItem(updateItem);
          }}
          label={attribute.name}
          variant="filled"
        />
      ))}
      <FormControlLabel
        control={<Checkbox checked={item.textChannel} onChange={(event) => setItem({ ...item, textChannel: event.target.checked })} />}
        label={t('commandSendSms')}
      />
    </>
  );
};

export default BaseCommandView;
