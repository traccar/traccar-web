import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import t from '../common/localization';
import { formatPosition, formatDistance } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';
import { columnWidthNormal } from '../common/style';

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

  const columns = [
    {
      headerName: t('positionFixTime'),
      field: 'fixTime',
      width: columnWidthNormal * 2,
      valueFormatter: params => formatPosition(params.value, 'fixTime'),
    },
    {
      headerName: t('positionLatitude'),
      field: 'latitude',
      width: columnWidthNormal,
      valueFormatter: params => formatPosition(params.value, 'latitude'),
    },
    {
      headerName: t('positionLongitude'),
      field: 'longitude',
      width: columnWidthNormal,
      valueFormatter: params => formatPosition(params.value, 'longitude'),
    },
    {
      headerName: t('positionSpeed'),
      field: 'speed',
      width: columnWidthNormal,
      valueFormatter: params => formatPosition(params.value, 'speed'),
    },
    {
      headerName: t('positionAddress'),
      field: 'address',
      width: columnWidthNormal,
      valueFormatter: params => formatPosition(params.value, 'address'),
    },
    {
      headerName: t('positionIgnition'),
      field: 'ignition',
      width: columnWidthNormal,
      valueFormatter: params => params.getValue('attributes').ignition ? 'Yes' : 'No',
    },
    {
      headerName: t('deviceTotalDistance'),
      hide: true,
      field: 'totalDistance',
      width: columnWidthNormal,
      valueFormatter: params => formatDistance(params.getValue('attributes').totalDistance, distanceUnit),
    },    
  ]

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <DataGrid rows={items} columns={columns} hideFooter/>
    </ReportLayoutPage>
  );
};

export default RouteReportPage;
