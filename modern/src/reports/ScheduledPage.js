import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table, TableRow, TableCell, TableHead, TableBody, IconButton,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import TableShimmer from '../common/components/TableShimmer';

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: '1%',
    paddingRight: theme.spacing(1),
  },
}));

const ScheduledPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const calendars = useSelector((state) => state.calendars.items);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const formatType = (type) => {
    switch (type) {
      case 'events':
        return t('reportEvents');
      case 'route':
        return t('reportRoute');
      case 'summary':
        return t('reportSummary');
      case 'trips':
        return t('reportTrips');
      case 'stops':
        return t('reportStops');
      default:
        return type;
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['settingsTitle', 'sharedDrivers']}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedType')}</TableCell>
            <TableCell>{t('sharedDescription')}</TableCell>
            <TableCell>{t('sharedCalendar')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{formatType(item.type)}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{calendars[item.calendarId].name}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <IconButton size="small" onClick={() => {}}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={4} endAction />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default ScheduledPage;
