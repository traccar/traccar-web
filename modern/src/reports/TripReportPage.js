import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { useTheme } from "@material-ui/core/styles";
import { formatDistance, formatSpeed, formatHours, formatDate, formatVolume } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';
import t from '../common/localization';

const Filter = ({ setItems }) => {

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/trips?${query.toString()}`, { headers });
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

  return <ReportFilter handleSubmit={handleSubmit} />;
}

const TripReportPage = () => {

  const theme = useTheme();
  
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');

  const [items, setItems] = useState([]);

  const columns = [{
    headerName: t('reportStartTime'),
    field: 'startTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value),
  }, {
    headerName: t('reportStartOdometer'),
    field: 'startOdometer',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportStartAddress'),
    field: 'startAddress',
    type: 'string',
    hide: true,
    width: theme.dimensions.columnWidthString,
  }, {
    headerName: t('reportEndTime'),
    field: 'endTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value),
  }, {
    headerName: t('reportEndOdometer'),
    field: 'endOdometer',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportEndAddress'),
    field: 'endAddress',
    type: 'string',
    hide: true,
    width: theme.dimensions.columnWidthString,
  }, {
    headerName: t('sharedDistance'),
    field: 'distance',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }, {
    headerName: t('reportAverageSpeed'),
    field: 'averageSpeed',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit),
  }, {
    headerName: t('reportMaximumSpeed'),
    field: 'maxSpeed',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit),
  }, {
    headerName: t('reportDuration'),
    field: 'duration',
    type: 'string',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => formatHours(value),
  }, {
    headerName: t('reportSpentFuel'),
    field: 'spentFuel',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    hide: true,
    valueFormatter: ({ value }) => formatVolume(value, volumeUnit),
  }, {
    headerName: t('sharedDriver'),
    field: 'driverName',
    type: 'string',
    width: theme.dimensions.columnWidthString,
    hide: true                                        
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

export default TripReportPage;
