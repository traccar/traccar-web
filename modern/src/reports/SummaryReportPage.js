import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import t from '../common/localization';
import { formatDistance, formatHours, formatDate, formatSpeed, formatVolume } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';

const Filter = ({ setItems }) => {

  const [daily, setDaily] = useState(false);

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, daily, mail });
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
  }

  return (
    <ReportFilter handleSubmit={handleSubmit}>
      <FormControlLabel
        control={<Checkbox checked={daily} onChange={e => setDaily(e.target.checked)} />}
        label={t('reportDaily')} />
    </ReportFilter>
  );
}

const SummaryReportPage = () => {

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [items, setItems] = useState([]);

  const columns = [{
    headerName: t('reportStartDate'),
    field: 'startTime',
    type: 'dateTime',
    flex: 1,
    valueFormatter: ({ value }) => formatDate(value, 'YYYY-MM-DD'),
  }, {
    headerName: t('sharedDistance'),
    field: 'distance',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportStartOdometer'),
    field: 'startOdometer',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportEndOdometer'),
    field: 'endOdometer',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportAverageSpeed'),
    field: 'averageSpeed',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit),
  }, {
    headerName: t('reportMaximumSpeed'),
    field: 'maxSpeed',
    type: 'number',
    flex: 1,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit),
  }, {
    headerName: t('reportEngineHours'),
    field: 'engineHours',
    type: 'string',
    flex: 1,
    valueFormatter: ({ value }) => formatHours(value),
  }, {
    headerName: t('reportSpentFuel'),
    field: 'spentFuel',
    type: 'number',
    flex: 1,
    hide: true,
    valueFormatter: ({ value }) => formatVolume(value, volumeUnit),                
  }]
  
  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <DataGrid
        rows={items} 
        columns={columns} 
        hideFooter 
        autoHeight
        getRowId={() => Math.random()} />
    </ReportLayoutPage>
  );
}

export default SummaryReportPage;
