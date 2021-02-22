
import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import t from '../common/localization';
import { formatDate } from '../common/formatter';
import ReportFilter from '../reports/ReportFilter';
import ReportLayoutPage from '../reports/ReportLayoutPage';

const Filter = ({ setItems }) => {

  const handleSubmit = async (deviceId, from, to, _, headers) => {
    const query = new URLSearchParams({ from, to });
    const response = await fetch(`/api/statistics?${query.toString()}`, { headers });
    if (response.ok) {
      setItems(await response.json());
    }
  }
  return <ReportFilter handleSubmit={handleSubmit} showOnly showDevices/>;
}

const StatisticsPage = () => {

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('statisticsCaptureTime')}</TableCell>
              <TableCell>{t('statisticsActiveUsers')}</TableCell>
              <TableCell>{t('statisticsActiveDevices')}</TableCell>
              <TableCell>{t('statisticsRequests')}</TableCell>
              <TableCell>{t('statisticsMessagesReceived')}</TableCell>
              <TableCell>{t('statisticsMessagesStored')}</TableCell>
              <TableCell>{t('notificatorMail')}</TableCell>
              <TableCell>{t('notificatorSms')}</TableCell>
              <TableCell>{t('statisticsGeocoder')}</TableCell>
              <TableCell>{t('statisticsGeolocation')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.captureTime)}</TableCell>
                <TableCell>{item.activeUsers}</TableCell>
                <TableCell>{item.activeDevices}</TableCell>
                <TableCell>{item.requests}</TableCell>
                <TableCell>{item.messagesReceived}</TableCell>
                <TableCell>{item.messagesStored}</TableCell>
                <TableCell>{item.mailSent}</TableCell>
                <TableCell>{item.smsSent}</TableCell>
                <TableCell>{item.geocoderRequests}</TableCell>
                <TableCell>{item.geolocationRequests}</TableCell>                           
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportLayoutPage>
  );
}

export default StatisticsPage;
