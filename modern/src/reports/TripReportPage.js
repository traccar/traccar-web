import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import t from '../common/localization';
import { formatPosition, formatDistance, formatSpeed, formatHours, formatDate } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';

const ReportFilterForm = ({ onResult }) => {

  const handleSubmit = async (deviceId, from, to) => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    const response = await fetch(`/api/reports/trips?${query.toString()}`, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      onResult(await response.json());
    }
  }
  return <ReportFilter handleSubmit={handleSubmit} />;
}

const TripReportPage = () => {
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const [items, setItems] = useState([]);
  
  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('reportStartTime')}</TableCell>
              <TableCell>{t('reportStartOdometer')}</TableCell>
              <TableCell>{t('reportEndTime')}</TableCell>
              <TableCell>{t('reportEndOdometer')}</TableCell>
              <TableCell>{t('sharedDistance')}</TableCell>
              <TableCell>{t('reportAverageSpeed')}</TableCell>
              <TableCell>{t('reportMaximumSpeed')}</TableCell>
              <TableCell>{t('reportDuration')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.startTime)}</TableCell>
                <TableCell>{formatDistance(item.startOdometer, distanceUnit)}</TableCell>
                <TableCell>{formatDate(item.endTime)}</TableCell>
                <TableCell>{formatDistance(item.endOdometer, distanceUnit)}</TableCell>
                <TableCell>{formatDistance(item.distance, distanceUnit)}</TableCell>
                <TableCell>{formatSpeed(item.averageSpeed, speedUnit)}</TableCell>
                <TableCell>{formatSpeed(item.maxSpeed, speedUnit)}</TableCell>
                <TableCell>{formatHours(item.duration)}</TableCell>                             
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportLayoutPage>
  );
}

export default TripReportPage;
