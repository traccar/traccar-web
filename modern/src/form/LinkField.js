import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { useState } from 'react';
import { useEffectAsync } from '../reactHelper';

const LinkField = ({
  margin,
  variant,
  label,
  endpointAll,
  endpointLinked,
  baseId,
  keyBase,
  keyLink,
  keyGetter = item => item.id,
  titleGetter = item => item.name,
}) => {
  const [items, setItems] = useState();
  const [linked, setLinked] = useState();

  useEffectAsync(async () => {
    const response = await fetch(endpointAll);
    if (response.ok) {
      setItems(await response.json());
    }
  }, []);

  useEffectAsync(async () => {
    const response = await fetch(endpointLinked);
    if (response.ok) {
      const data = await response.json();
      setLinked(data.map(it => it.id));
    }
  }, []);

  const createBody = linkId => {
    const body = {};
    body[keyBase] = baseId;
    body[keyLink] = linkId;
    return body;
  }

  const onChange = async event => {
    const oldValue = linked;
    const newValue = event.target.value;
    for (const added of newValue.filter(it => !oldValue.includes(it))) {
      await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createBody(added)),
      });
    }
    for (const removed of oldValue.filter(it => !newValue.includes(it))) {
      await fetch('/api/permissions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createBody(removed)),
      });
    }
    setLinked(newValue);
  };

  if (items && linked) {
    return (
      <FormControl margin={margin} variant={variant}>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={linked}
          onChange={onChange}>
          {items.map(item => (
            <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  } else {
    return null;
  }
}

export default LinkField;
