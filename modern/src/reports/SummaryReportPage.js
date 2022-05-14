import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
  FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import {
  formatDistance, formatHours, formatDate, formatSpeed, formatVolume,
} from '../common/util/formatter';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import { useAttributePreference } from '../common/util/preferences';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';

const Filter = ({ setItems }) => {
  const classes = useFilterStyles();
  const t = useTranslation();

  const [daily, setDaily] = useState(false);

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({
      deviceId, from, to, daily, mail,
    });
    const response = await fetch(`/api/reports/summary?${query.toString()}`, { headers });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        if (contentType === 'application/json') {
          setItems(await response.json());
        } else {
          window.location.assign(window.URL.createObjectURL(await response.blob()));
        }
      }
    }
  };

  return (
    <ReportFilter handleSubmit={handleSubmit}>
      <div className={classes.item}>
        <FormControl variant="filled" fullWidth>
          <InputLabel>{t('sharedType')}</InputLabel>
          <Select value={daily} onChange={(e) => setDaily(e.target.value)}>
            <MenuItem value={false}>{t('reportSummary')}</MenuItem>
            <MenuItem value>{t('reportDaily')}</MenuItem>
          </Select>
        </FormControl>
      </div>
    </ReportFilter>
  );
};

const SummaryReportPage = () => {
  const theme = useTheme();
  const t = useTranslation();

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [items, setItems] = useState([]);

  const columns = [{
    headerName: t('reportStartDate'),
    field: 'startTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value, 'YYYY-MM-DD'),
  }, {
    headerName: t('sharedDistance'),
    field: 'distance',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit, t),
  }, {
    headerName: t('reportStartOdometer'),
    field: 'startOdometer',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit, t),
  }, {
    headerName: t('reportEndOdometer'),
    field: 'endOdometer',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit, t),
  }, {
    headerName: t('reportAverageSpeed'),
    field: 'averageSpeed',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit, t),
  }, {
    headerName: t('reportMaximumSpeed'),
    field: 'maxSpeed',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit, t),
  }, {
    headerName: t('reportEngineHours'),
    field: 'engineHours',
    type: 'string',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatHours(value),
  }, {
    headerName: t('reportSpentFuel'),
    field: 'spentFuel',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    hide: true,
    valueFormatter: ({ value }) => formatVolume(value, volumeUnit, t),
  }];

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportSummary']}>
      <Filter setItems={setItems} />
      <DataGrid
        rows={items}
        columns={columns}
        hideFooter
        autoHeight
        getRowId={() => Math.random()}
      />
    </PageLayout>
  );
};

export default SummaryReportPage;
