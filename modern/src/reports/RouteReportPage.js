import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import t from '../common/localization';
import { formatPosition } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';

const ReportFilterForm = ({ onResult }) => {

  const handleSubmit = async (deviceId, from, to) => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    const response = await fetch(`/api/reports/route?${query.toString()}`, { headers: { Accept: 'application/json' } });
    if(response.ok) {
      onResult(await response.json());
    }
  }
  return <ReportFilter handleSubmit={handleSubmit} />;
}

const RouteReportPage = () => {
  const [items, setItems] = useState([]);
  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems}>
      <TableContainer component={Paper}>
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
      </TableContainer>
    </ReportLayoutPage>
  );
}

export default RouteReportPage;
