import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import t from '../common/localization';
import { formatPosition, formatDistance } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';

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

  const columns = [{
      headerName: t('positionFixTime'),
      field: 'fixTime',
      type: 'dateTime',
      flex: 1,
      valueFormatter: ({ value }) => formatPosition(value, 'fixTime'),
    }, {
      headerName: t('positionLatitude'),
      field: 'latitude',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => formatPosition(value, 'latitude'),
    }, {
      headerName: t('positionLongitude'),
      field: 'longitude',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => formatPosition(value, 'longitude'),
    }, {
      headerName: t('positionSpeed'),
      field: 'speed',
      type: 'number',
      flex: 1,
      valueFormatter: ({ value }) => formatPosition(value, 'speed'),
    }, {
      headerName: t('positionAddress'),
      field: 'address',
      type: 'string',
      flex: 1,
      valueFormatter: ({ value }) => formatPosition(value, 'address'),
    }, {
      headerName: t('positionIgnition'),
      field: 'ignition',
      type: 'boolean',
      flex: 1,
      valueFormatter: ({ getValue }) => getValue('attributes').ignition ? 'Yes' : 'No',
    }, {
      headerName: t('deviceTotalDistance'),
      field: 'totalDistance',
      type: 'number',
      hide: true,
      flex: 1,
      valueFormatter: ({ getValue }) => formatDistance(getValue('attributes').totalDistance, distanceUnit),
    },    
  ]

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <DataGrid
        rows={items} 
        columns={columns} 
        hideFooter 
        autoHeight />
    </ReportLayoutPage>
  );
};

export default RouteReportPage;
