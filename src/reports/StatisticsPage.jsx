import { useState } from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  MenuItem,
  TextField,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatTime } from '../common/util/formatter';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatchCallback } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import fetchOrThrow from '../common/util/fetchOrThrow';

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

export const StatisticsTypeSelect = () => {
  const { classes } = useReportStyles();
  const t = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={classes.filterItem}>
      <TextField
        select
        fullWidth
        label={t('sharedType')}
        value={location.pathname}
        onChange={(event) => navigate({ pathname: event.target.value, search: location.search })}
      >
        <MenuItem value="/reports/statistics">{t('settingsServer')}</MenuItem>
        <MenuItem value="/reports/device-statistics">{t('deviceTitle')}</MenuItem>
      </TextField>
    </div>
  );
};

const StatisticsPage = () => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const [columns, setColumns] = usePersistedState('statisticsColumns', [
    'captureTime',
    'activeUsers',
    'activeDevices',
    'messagesStored',
  ]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const onShow = useCatchCallback(async ({ from, to }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ from, to });
      const response = await fetchOrThrow(`/api/statistics?${query.toString()}`);
      setItems(await response.json());
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} deviceType="none" loading={loading}>
          <StatisticsTypeSelect />
          <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
        </ReportFilter>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((key) => (
              <TableCell key={key}>{t(columnsMap.get(key))}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? (
            items.map((item) => (
              <TableRow key={item.id}>
                {columns.map((key) => (
                  <TableCell key={key}>
                    {key === 'captureTime' ? formatTime(item[key], 'date') : item[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableShimmer columns={columns.length} />
          )}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default StatisticsPage;
