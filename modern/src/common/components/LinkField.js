import {
  FormControl, InputLabel, MenuItem, Select, Skeleton,
} from '@mui/material';
import React, { useState } from 'react';
import { useEffectAsync } from '../../reactHelper';

const LinkField = ({
  label,
  endpointAll,
  endpointLinked,
  baseId,
  keyBase,
  keyLink,
  keyGetter = (item) => item.id,
  titleGetter = (item) => item.name,
}) => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState();
  const [linked, setLinked] = useState();

  useEffectAsync(async () => {
    if (active) {
      const response = await fetch(endpointAll);
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    }
  }, [active]);

  useEffectAsync(async () => {
    if (active) {
      const response = await fetch(endpointLinked);
      if (response.ok) {
        const data = await response.json();
        setLinked(data.map((it) => it.id));
      } else {
        throw Error(await response.text());
      }
    }
  }, [active]);

  const createBody = (linkId) => {
    const body = {};
    body[keyBase] = baseId;
    body[keyLink] = linkId;
    return body;
  };

  const onChange = async (event) => {
    const oldValue = linked;
    const newValue = event.target.value;
    if (!newValue.find((it) => it < 0)) {
      const results = [];
      newValue.filter((it) => !oldValue.includes(it)).forEach((added) => {
        results.push(fetch('/api/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody(added)),
        }));
      });
      oldValue.filter((it) => !newValue.includes(it)).forEach((removed) => {
        results.push(fetch('/api/permissions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody(removed)),
        }));
      });
      await Promise.all(results);
      setLinked(newValue);
    }
  };

  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        open={open}
        onOpen={() => {
          setActive(true);
          setOpen(true);
        }}
        onClose={() => setOpen(false)}
        value={linked || []}
        onChange={onChange}
        multiple
      >
        {items && linked
          ? items.map((item) => (
            <MenuItem key={keyGetter(item)} value={keyGetter(item)}>{titleGetter(item)}</MenuItem>
          ))
          : [...Array(3)].map((_, i) => (
            <MenuItem key={-i - 1} value={-i - 1}>
              <Skeleton variant="text" width={`${Math.floor(Math.random() * 30 + 30)}%`} />
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default LinkField;
