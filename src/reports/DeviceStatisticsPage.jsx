import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableRow, TableCell, TableHead, TableBody } from '@mui/material';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import ReportFilter from './components/ReportFilter';
import { StatisticsTypeSelect } from './StatisticsPage';
import { useCatchCallback } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';
import SelectField from '../common/components/SelectField';
import fetchOrThrow from '../common/util/fetchOrThrow';

const deviceColumns = [
  ['deviceName', 'sharedDevice'],
  ['messagesStored', 'statisticsMessagesStored'],
];

const DeviceStatisticsPage = () => {
  const { classes } = useReportStyles();
  const t = useTranslation();
  const currentUserId = useSelector((state) => state.session.user.id);
  const [userId, setUserId] = useState(currentUserId);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const onShow = useCatchCallback(
    async ({ from, to }) => {
      setLoading(true);
      setItems([]);
      try {
        const query = new URLSearchParams({ from, to, userId });
        const response = await fetchOrThrow(`/api/statistics/devices?${query.toString()}`);
        setItems(await response.json());
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'statisticsTitle']}>
      <div className={classes.header}>
        <ReportFilter onShow={onShow} deviceType="none" loading={loading}>
          <StatisticsTypeSelect />
          <div className={classes.filterItem}>
            <SelectField
              endpoint="/api/users"
              label={t('settingsUsers')}
              value={userId}
              fullWidth
              onChange={(event) => setUserId(event.target.value || currentUserId)}
            />
          </div>
        </ReportFilter>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {deviceColumns.map(([key, label]) => (
              <TableCell key={key}>{t(label)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? (
            items.map((item) => (
              <TableRow key={item.deviceId}>
                {deviceColumns.map(([key]) => (
                  <TableCell key={key}>{item[key]}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableShimmer columns={deviceColumns.length} />
          )}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default DeviceStatisticsPage;
