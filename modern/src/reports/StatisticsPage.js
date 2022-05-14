import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
} from '@material-ui/core';
import { formatDate } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';

const StatisticsPage = () => {
  const t = useTranslation();

  const [items, setItems] = useState([]);

  const handleSubmit = async (from, to) => {
    const query = new URLSearchParams({ from, to });
    const response = await fetch(`/api/statistics?${query.toString()}`, { Accept: 'application/json' });
    if (response.ok) {
      setItems(await response.json());
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly ignoreDevice />
      <TableContainer>
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
    </PageLayout>
  );
};

export default StatisticsPage;
