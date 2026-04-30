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

  const onChange = useCatchCallback(
    async (value) => {
      const oldValue = linked.map((it) => keyGetter(it));
      const newValue = value.map((it) => keyGetter(it));
      if (!newValue.find((it) => it < 0)) {
        const results = [];
        newValue
          .filter((it) => !oldValue.includes(it))
          .forEach((added) => {
            results.push(
              fetchOrThrow('/api/permissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createBody(added)),
              }),
            );
          });
        oldValue
          .filter((it) => !newValue.includes(it))
          .forEach((removed) => {
            results.push(
              fetchOrThrow('/api/permissions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createBody(removed)),
              }),
            );
          });
        await Promise.all(results);
        setUpdated(results.length > 0);
        setLinked(value);
      }
    },
    [linked, setUpdated, setLinked],
  );

  return (
    <>
      <Autocomplete
        size="small"
        loading={active && !items}
        isOptionEqualToValue={(i1, i2) => keyGetter(i1) === keyGetter(i2)}
        options={items || []}
        getOptionLabel={(item) => titleGetter(item)}
        slotProps={{ chip: { size: 'small' } }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={!active ? t('reportShow') : null}
            onFocus={() => setActive(true)}
            slotProps={{
              ...params.slotProps,
              inputLabel: {
                ...params.slotProps?.inputLabel,
                shrink: !active || params.slotProps?.inputLabel?.shrink,
              },
            }}
          />
        )}
        value={(items && linked) || []}
        onChange={(_, value) => onChange(value)}
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
