import { Autocomplete, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { useCatchCallback, useEffectAsync } from '../../reactHelper';
import { snackBarDurationShortMs } from '../util/duration';
import { useTranslation } from './LocalizationProvider';
import fetchOrThrow from '../util/fetchOrThrow';

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
  const t = useTranslation();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState();
  const [linked, setLinked] = useState();
  const [updated, setUpdated] = useState(false);

  useEffectAsync(async () => {
    if (active) {
      const response = await fetchOrThrow(endpointAll);
      setItems(await response.json());
    }
  }, [active]);

  useEffectAsync(async () => {
    if (active) {
      const response = await fetchOrThrow(endpointLinked);
      setLinked(await response.json());
    }
  }, [active]);

  const createBody = (linkId) => {
    const body = {};
    body[keyBase] = baseId;
    body[keyLink] = linkId;
    return body;
  };

  const onChange = useCatchCallback(async (value) => {
    const oldValue = linked.map((it) => keyGetter(it));
    const newValue = value.map((it) => keyGetter(it));
    if (!newValue.find((it) => it < 0)) {
      const results = [];
      newValue.filter((it) => !oldValue.includes(it)).forEach((added) => {
        results.push(fetchOrThrow('/api/permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody(added)),
        }));
      });
      oldValue.filter((it) => !newValue.includes(it)).forEach((removed) => {
        results.push(fetchOrThrow('/api/permissions', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(createBody(removed)),
        }));
      });
      await Promise.all(results);
      setUpdated(results.length > 0);
      setLinked(value);
    }
  }, [linked, setUpdated, setLinked]);

  return (
    <>
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
      <Snackbar
        open={Boolean(updated)}
        onClose={() => setUpdated(false)}
        autoHideDuration={snackBarDurationShortMs}
        message={t('sharedSaved')}
      />
    </>
  );
};

export default LinkField;
