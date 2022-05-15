import React from 'react';
import {
  FormControl, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useFilterStyles } from './ReportFilter';

const ColumnSelect = ({ columns, setColumns, columnsArray }) => {
  const classes = useFilterStyles();
  const t = useTranslation();

  return (
    <div className={classes.item}>
      <FormControl variant="filled" fullWidth>
        <InputLabel>{t('sharedColumns')}</InputLabel>
        <Select
          value={columns}
          onChange={(e) => setColumns(e.target.value)}
          renderValue={(it) => it.length}
          multiple
        >
          {columnsArray.map(([key, string]) => (
            <MenuItem value={key}>{t(string)}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ColumnSelect;
