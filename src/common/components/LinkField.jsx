import { Autocomplete, TextField } from '@mui/material';
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
        const data = await response.json();
        data.sort((a, b) => titleGetter(a).localeCompare(titleGetter(b)));
        setItems(data);
      } else {
        throw Error(await response.text());
      }
    }
  }, [active]);

  useEffectAsync(async () => {
    if (active) {
      const response = await fetch(endpointLinked);
      if (response.ok) {
        setLinked(await response.json());
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

  const onChange = async (value) => {
    const oldValue = linked.map((it) => keyGetter(it));
    const newValue = value.map((it) => keyGetter(it));
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
      setLinked(value);
    }
  };

  return (
    <Autocomplete
      loading={active && !items}
      isOptionEqualToValue={(i1, i2) => keyGetter(i1) === keyGetter(i2)}
      options={items || []}
      getOptionLabel={(item) => titleGetter(item)}
      renderInput={(params) => <TextField {...params} label={label} />}
      value={(items && linked) || []}
      onChange={(_, value) => onChange(value)}
      open={open}
      onOpen={() => {
        setOpen(true);
        setActive(true);
      }}
      onClose={() => setOpen(false)}
      multiple
    />
  );
};

export default LinkField;
