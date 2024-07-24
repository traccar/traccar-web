import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableRow, TableCell, TableHead, TableBody, Button, TableFooter, FormControlLabel, Switch,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionFab from './components/CollectionFab';
import CollectionActions from './components/CollectionActions';
import TableShimmer from '../common/components/TableShimmer';
import SearchHeader, { filterByKeyword } from './components/SearchHeader';
import { formatTime } from '../common/util/formatter';
import { useAdministrator, useDeviceReadonly } from '../common/util/permissions';
import useSettingsStyles from './common/useSettingsStyles';
import DeviceUsersValue from './components/DeviceUsersValue';

const DevicesPage = () => {
  const classes = useSettingsStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const groups = useSelector((state) => state.groups.items);

  const admin = useAdministrator();
  const deviceReadonly = useDeviceReadonly();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ all: showAll });
      const response = await fetch(`/api/devices?${query.toString()}`);
      if (response.ok) {
        setItems(await response.json());
      } else {
        throw Error(await response.text());
      }
    } finally {
      setLoading(false);
    }
  }, [timestamp, showAll]);

  const handleExport = () => {
    window.location.assign('/api/reports/devices/xlsx');
  };

  const actionConnections = {
    key: 'connections',
    title: t('sharedConnections'),
    icon: <LinkIcon fontSize="small" />,
    handler: (deviceId) => navigate(`/settings/device/${deviceId}/connections`),
  };

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'deviceTitle']}>
      <SearchHeader keyword={searchKeyword} setKeyword={setSearchKeyword} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('deviceIdentifier')}</TableCell>
            <TableCell>{t('groupParent')}</TableCell>
            <TableCell>{t('sharedPhone')}</TableCell>
            <TableCell>{t('deviceModel')}</TableCell>
            <TableCell>{t('deviceContact')}</TableCell>
            <TableCell>{t('userExpirationTime')}</TableCell>
            {admin && <TableCell>{t('settingsUsers')}</TableCell>}
            <TableCell className={classes.columnAction} />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.filter(filterByKeyword(searchKeyword)).map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.uniqueId}</TableCell>
              <TableCell>{item.groupId ? groups[item.groupId]?.name : null}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.model}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{formatTime(item.expirationTime, 'date')}</TableCell>
              {admin && <TableCell><DeviceUsersValue deviceId={item.id} /></TableCell>}
              <TableCell className={classes.columnAction} padding="none">
                <CollectionActions
                  itemId={item.id}
                  editPath="/settings/device"
                  endpoint="devices"
                  setTimestamp={setTimestamp}
                  customActions={[actionConnections]}
                  readonly={deviceReadonly}
                />
              </TableCell>
            </TableRow>
          )) : (<TableShimmer columns={admin ? 8 : 7} endAction />)}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <Button onClick={handleExport} variant="text">{t('reportExport')}</Button>
            </TableCell>
            <TableCell colSpan={admin ? 8 : 7} align="right">
              <FormControlLabel
                control={(
                  <Switch
                    value={showAll}
                    onChange={(e) => setShowAll(e.target.checked)}
                    size="small"
                  />
                )}
                label={t('notificationAlways')}
                labelPlacement="start"
                disabled={!admin}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <CollectionFab editPath="/settings/device" />
    </PageLayout>
  );
};

export default DevicesPage;
