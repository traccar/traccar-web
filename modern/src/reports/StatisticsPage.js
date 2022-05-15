import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { formatDate } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter, { useFilterStyles } from './components/ReportFilter';
import usePersistedState from '../common/util/usePersistedState';

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
  const classes = useFilterStyles();
  const t = useTranslation();

  const [columns, setColumns] = usePersistedState('statisticsColumns', ['captureTime', 'activeUsers', 'activeDevices', 'messagesStored']);
  const [items, setItems] = useState([]);

  const handleSubmit = async (_, from, to) => {
    const query = new URLSearchParams({ from, to });
    const response = await fetch(`/api/statistics?${query.toString()}`, { Accept: 'application/json' });
    if (response.ok) {
      setItems(await response.json());
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <ReportFilter handleSubmit={handleSubmit} showOnly ignoreDevice>
        <div className={classes.item}>
          <FormControl variant="filled" fullWidth>
            <InputLabel>{t('sharedColumns')}</InputLabel>
            <Select value={columns} onChange={(e) => setColumns(e.target.value)} renderValue={(it) => it.length} multiple>
              {columnsArray.map(([key, string]) => (
                <MenuItem value={key}>{t(string)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
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
