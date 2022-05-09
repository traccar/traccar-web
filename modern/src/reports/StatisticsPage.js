import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, TextField, Button, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import { formatDate } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';

const useStyles = makeStyles((theme) => ({
  filter: {
    margin: theme.spacing(1),
  },
}));

const Filter = ({ setItems }) => {
  const classes = useStyles();
  const t = useTranslation();

  const [period, setPeriod] = useState('today');
  const [from, setFrom] = useState(moment().subtract(1, 'hour'));
  const [to, setTo] = useState(moment());

  const handleClick = async () => {
    let selectedFrom;
    let selectedTo;
    switch (period) {
      case 'today':
        selectedFrom = moment().startOf('day');
        selectedTo = moment().endOf('day');
        break;
      case 'yesterday':
        selectedFrom = moment().subtract(1, 'day').startOf('day');
        selectedTo = moment().subtract(1, 'day').endOf('day');
        break;
      case 'thisWeek':
        selectedFrom = moment().startOf('week');
        selectedTo = moment().endOf('week');
        break;
      case 'previousWeek':
        selectedFrom = moment().subtract(1, 'week').startOf('week');
        selectedTo = moment().subtract(1, 'week').endOf('week');
        break;
      case 'thisMonth':
        selectedFrom = moment().startOf('month');
        selectedTo = moment().endOf('month');
        break;
      case 'previousMonth':
        selectedFrom = moment().subtract(1, 'month').startOf('month');
        selectedTo = moment().subtract(1, 'month').endOf('month');
        break;
      default:
        selectedFrom = from;
        selectedTo = to;
        break;
    }

    const query = new URLSearchParams({ from: selectedFrom.toISOString(), to: selectedTo.toISOString() });
    const response = await fetch(`/api/statistics?${query.toString()}`, { Accept: 'application/json' });
    if (response.ok) {
      setItems(await response.json());
    }
  };

  return (
    <div className={classes.filter}>
      <FormControl variant="filled" margin="normal" fullWidth>
        <InputLabel>{t('reportPeriod')}</InputLabel>
        <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <MenuItem value="today">{t('reportToday')}</MenuItem>
          <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
          <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
          <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
          <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
          <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
          <MenuItem value="custom">{t('reportCustom')}</MenuItem>
        </Select>
      </FormControl>
      {period === 'custom' && (
        <TextField
          margin="normal"
          variant="filled"
          label={t('reportFrom')}
          type="datetime-local"
          value={from.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={(e) => setFrom(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth
        />
      )}
      {period === 'custom' && (
        <TextField
          margin="normal"
          variant="filled"
          label={t('reportTo')}
          type="datetime-local"
          value={to.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={(e) => setTo(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth
        />
      )}
      <Button variant="outlined" color="secondary" onClick={handleClick} fullWidth>{t('reportShow')}</Button>
    </div>
  );
};

const StatisticsPage = () => {
  const t = useTranslation();

  const [items, setItems] = useState([]);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <Filter setItems={setItems} />
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
