import React, { useState } from 'react';
import { Paper } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useTheme } from "@material-ui/core/styles";
import { formatDistance, formatSpeed, formatBoolean, formatDate, formatCoordinate } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference, usePreference } from '../common/preferences';
import t from '../common/localization';

const Filter = ({ setItems }) => {

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers });
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
};

const RouteReportPage = () => {
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const coordinateFormat = usePreference('coordinateFormat');
  const theme = useTheme();

  const columns = [{
    headerName: t('positionFixTime'),
    field: 'fixTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value),
  }, {
    headerName: t('positionLatitude'),
    field: 'latitude',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatCoordinate('latitude', value, coordinateFormat),
  }, {
    headerName: t('positionLongitude'),
    field: 'longitude',
    type: 'number',
    width: theme.dimensions.columnWidthNumber,
    valueFormatter: ({ value }) => formatCoordinate('longitude', value, coordinateFormat),
  }, {
    headerName: t('positionSpeed'),
    field: 'speed',
    type: 'number',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => formatSpeed(value, speedUnit),
  }, {
    headerName: t('positionAddress'),
    field: 'address',
    type: 'string',
    width: theme.dimensions.columnWidthString,
  }, {
    headerName: t('positionIgnition'),
    field: 'ignition',
    type: 'boolean',
    width: theme.dimensions.columnWidthBoolean,
    valueGetter: ({ row }) => row.attributes.ignition,
    valueFormatter: ({ value }) => formatBoolean(value),
  }, {
    headerName: t('deviceTotalDistance'),
    field: 'totalDistance',
    type: 'number',
    hide: true,
    width: theme.dimensions.columnWidthNumber,
    valueGetter: ({ row }) => row.attributes.totalDistance,
    valueFormatter: ({ value }) => formatDistance(value, distanceUnit),
  }]

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <Paper>
        <DataGrid
          rows={items} 
          columns={columns} 
          hideFooter 
          autoHeight />
      </Paper>
    </ReportLayoutPage>
  );
};

export default RouteReportPage;
