import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import t from '../common/localization';
import { formatDistance, formatHours, formatDate, formatVolume } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';

const Filter = ({ setItems }) => {

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    const response = await fetch(`/api/reports/stops?${query.toString()}`, { headers });
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

const StopReportPage = () => {

  const distanceUnit = useAttributePreference('distanceUnit');
  const [items, setItems] = useState([]);
  
  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('reportStartTime')}</TableCell>
              <TableCell>{t('positionOdometer')}</TableCell>
              <TableCell>{t('reportEndTime')}</TableCell>
              <TableCell>{t('reportDuration')}</TableCell>
              <TableCell>{t('reportEngineHours')}</TableCell>
              <TableCell>{t('reportSpentFuel')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.startTime)}</TableCell>
                <TableCell>{formatDistance(item.startOdometer, distanceUnit)}</TableCell>
                <TableCell>{formatDate(item.endTime)}</TableCell>
                <TableCell>{formatHours(item.duration)}</TableCell>
                <TableCell>{formatHours(item.engineHours)}</TableCell>
                <TableCell>{formatVolume(item.spentFuel)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportLayoutPage>
  );
};

export default StopReportPage;
