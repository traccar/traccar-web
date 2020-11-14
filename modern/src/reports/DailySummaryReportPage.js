import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import t from '../common/localization';
import { formatDistance, formatHours, formatDate, formatSpeed, formatVolume } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { useAttributePreference } from '../common/preferences';

const ReportFilterForm = ({ onResult }) => {

  const handleSubmit = async (deviceId, from, to) => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
      daily: true
    });
    const response = await fetch(`/api/reports/summary?${query.toString()}`, { headers: { Accept: 'application/json' } });
    if (response.ok) {
      onResult(await response.json());
    }
  }
  return <ReportFilter handleSubmit={handleSubmit} />;
}

const DailySummaryReportPage = () => {

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const [items, setItems] = useState([]);
  
  return (
    <ReportLayoutPage reportFilterForm={ReportFilterForm} setItems={setItems}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('reportStartDate')}</TableCell>
              <TableCell>{t('sharedDistance')}</TableCell>
              <TableCell>{t('reportStartOdometer')}</TableCell>
              <TableCell>{t('reportEndOdometer')}</TableCell>
              <TableCell>{t('reportAverageSpeed')}</TableCell>
              <TableCell>{t('reportMaximumSpeed')}</TableCell>
              <TableCell>{t('reportEngineHours')}</TableCell>              
              <TableCell>{t('reportSpentFuel')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.startTime, 'YYYY-MM-DD')}</TableCell>
                <TableCell>{formatDistance(item.distance, distanceUnit)}</TableCell>
                <TableCell>{formatDistance(item.startOdometer, distanceUnit)}</TableCell>
                <TableCell>{formatDistance(item.endOdometer, distanceUnit)}</TableCell>
                <TableCell>{formatSpeed(item.averageSpeed, speedUnit)}</TableCell>
                <TableCell>{formatSpeed(item.maxSpeed, speedUnit)}</TableCell>
                <TableCell>{formatHours(item.engineHours)}</TableCell>
                <TableCell>{formatVolume(item.spentFuel)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportLayoutPage>
  );
}

export default DailySummaryReportPage;
