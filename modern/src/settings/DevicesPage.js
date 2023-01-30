import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, TableHead, TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionFab from './components/CollectionFab';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader, { filterByKeyword } from './components/SearchHeader';
import { usePreference } from '../common/util/preferences';
import { formatTime } from '../common/util/formatter';

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: '1%',
    paddingRight: theme.spacing(1),
  },
}));

const DevicesPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const hours12 = usePreference('twelveHourFormat');

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/devices');
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedDrivers']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('deviceIdentifier')}</TableCell>
            <TableCell>{t('sharedPhone')}</TableCell>
            <TableCell>{t('deviceModel')}</TableCell>
            <TableCell>{t('deviceContact')}</TableCell>
            <TableCell>{t('userExpirationTime')}</TableCell>
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.uniqueId}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{formatTime(item.expirationTime, 'date', hours12)}</TableCell>
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions itemId={item.id} editPath="/settings/device" endpoint="devices" setTimestamp={setTimestamp} />
              </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={6} endAction />)}
        </TableBody>
      </Table>
      <CollectionFab editPath="/settings/device" />
    </PageLayout>
  );
};

export default DevicesPage;
