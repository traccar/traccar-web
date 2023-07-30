import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import useReportStyles from '../../reports/common/useReportStyles';
import { useEffectAsync } from '../../reactHelper';
import { prefixString } from '../util/stringUtils';

const EventFilter = ({ eventTypes, setEventTypes }) => {
  const [allEventTypes, setAllEventTypes] = useState([['allEvents', 'eventAll']]);
  const classes = useReportStyles();
  const t = useTranslation();

  useEffectAsync(async () => {
    const response = await fetch('/api/notifications/types');
    if (response.ok) {
      const types = await response.json();
      setAllEventTypes([...allEventTypes, ...types.map((it) => [it.type, prefixString('event', it.type)])]);
    } else {
      throw Error(await response.text());
    }
  }, []);

  return (
    <div className={classes.filterItem}>
      <FormControl fullWidth>
        <InputLabel>{t('reportEventTypes')}</InputLabel>
        <Select
          label={t('reportEventTypes')}
          value={eventTypes}
          onChange={(event, child) => {
            let values = event.target.value;
            const clicked = child.props.value;
            if (values.includes('allEvents') && values.length > 1) {
              values = [clicked];
            }
            setEventTypes(values);
          }}
          multiple
        >
          {allEventTypes.map(([key, string]) => (
            <MenuItem key={key} value={key}>{t(string)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default EventFilter;
