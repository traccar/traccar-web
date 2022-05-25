import React from 'react';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useFilterStyles } from './ReportFilter';

const ColumnSelect = ({
  columns, setColumns, columnsArray, columnsObject,
}) => {
  const classes = useFilterStyles();
  const t = useTranslation();

  return (
    <div className={classes.item}>
      <FormControl fullWidth>
        <InputLabel>{t('sharedColumns')}</InputLabel>
        <Select
          label={t('sharedColumns')}
          value={columns}
          onChange={(e) => setColumns(e.target.value)}
          multiple
        >
          {columnsArray
            ? columnsArray.map(([key, string]) => (
              <MenuItem key={key} value={key}>{t(string)}</MenuItem>
            ))
            : Object.keys(columnsObject).map((key) => (
              <MenuItem key={key} value={key}>{columnsObject[key].name}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ColumnSelect;
