import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
} from '@material-ui/core';
import { formatDate } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch } from '../reactHelper';

const columnsArray = [
  ['captureTime', 'statisticsCaptureTime'],
  ['activeUsers', 'statisticsActiveUsers'],
  ['activeDevices', 'statisticsActiveDevices'],
  ['requests', 'statisticsRequests'],
  ['messagesReceived', 'statisticsMessagesReceived'],
  ['messagesStored', 'statisticsMessagesStored'],
  ['mailSent', 'notificatorMail'],
  ['smsSent', 'notificatorSms'],
  ['geocoderRequests', 'statisticsGeocoder'],
  ['geolocationRequests', 'statisticsGeolocation'],
];
const columnsMap = new Map(columnsArray);

const StatisticsPage = () => {
  const t = useTranslation();

  const [columns, setColumns] = usePersistedState('statisticsColumns', ['captureTime', 'activeUsers', 'activeDevices', 'messagesStored']);
  const [items, setItems] = useState([]);

  const handleSubmit = useCatch(async (_, from, to) => {
    const query = new URLSearchParams({ from, to });
    const response = await fetch(`/api/statistics?${query.toString()}`, { Accept: 'application/json' });
    if (response.ok) {
      setItems(await response.json());
    } else {
      throw Error(await response.text());
    }
  });

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly ignoreDevice>
        <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
      </ReportFilter>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((key) => (<TableCell>{t(columnsMap.get(key))}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((key) => (
                  <TableCell>
                    {key === 'captureTime' ? formatDate(item[key]) : item[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};

export default StatisticsPage;
