import React, { useState } from 'react';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@material-ui/core';
import t from '../common/localization';
import { formatPosition } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import ReportCard from './ReportCard';

const ReportFilterForm = ({ setItems }) => {

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

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems}>
      <ReportCard title="Route Report" >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('positionFixTime')}</TableCell>
              <TableCell>{t('positionLatitude')}</TableCell>
              <TableCell>{t('positionLongitude')}</TableCell>
              <TableCell>{t('positionSpeed')}</TableCell>
              <TableCell>{t('positionAddress')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatPosition(item, 'fixTime')}</TableCell>
                <TableCell>{formatPosition(item, 'latitude')}</TableCell>
                <TableCell>{formatPosition(item, 'longitude')}</TableCell>
                <TableCell>{formatPosition(item, 'speed')}</TableCell>
                <TableCell>{formatPosition(item, 'address')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ReportCard>
    </ReportLayoutPage>
  );
};

export default RouteReportPage;
