import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper, FormControlLabel, Checkbox } from '@material-ui/core';
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
  const [items, setItems] = useState([]);
  
  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
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

export default SummaryReportPage;
