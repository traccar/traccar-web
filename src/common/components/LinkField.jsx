import { Autocomplete, Snackbar, TextField } from '@mui/material';
import { useState } from 'react';
import { useCatchCallback, useAsyncTask } from '../../reactHelper';
import { snackBarDurationShortMs } from '../util/duration';
import { useTranslation } from './LocalizationProvider';
import fetchOrThrow from '../util/fetchOrThrow';

const defaultTitleGetter = (item) => item.name;

const LinkField = ({
  label,
  endpointAll,
  endpointLinked,
  baseId,
  keyBase,
  keyLink,
  titleGetter = defaultTitleGetter,
}) => {
  const t = useTranslation();
  const [active, setActive] = useState(false);
  const [items, setItems] = useState();
  const [linked, setLinked] = useState();
  const [updated, setUpdated] = useState(false);

  useAsyncTask(
    async ({ signal }) => {
      if (active) {
        const response = await fetchOrThrow(endpointAll, { signal });
        setItems(await response.json());
      }
    },
    [active, endpointAll],
  );

  useAsyncTask(
    async ({ signal }) => {
      if (active) {
        const response = await fetchOrThrow(endpointLinked, { signal });
        setLinked(await response.json());
      }
    },
    [active, endpointLinked],
  );

  const onChange = useCatchCallback(
    async (value) => {
      const createBody = (linkId) => ({ [keyBase]: baseId, [keyLink]: linkId });
      const oldValue = linked.map((it) => it.id);
      const newValue = value.map((it) => it.id);
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
    [linked, baseId, keyBase, keyLink],
  );

  return (
    <>
      <Autocomplete
        size="small"
        loading={active && !items}
        isOptionEqualToValue={(i1, i2) => i1.id === i2.id}
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
