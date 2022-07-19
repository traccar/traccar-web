import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { formatTime } from '../common/util/formatter';
import ReportFilter from './components/ReportFilter';
import { prefixString } from '../common/util/stringUtils';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import ReportsMenu from './components/ReportsMenu';
import usePersistedState from '../common/util/usePersistedState';
import ColumnSelect from './components/ColumnSelect';
import { useCatch, useEffectAsync } from '../reactHelper';
import useReportStyles from './common/useReportStyles';
import TableShimmer from '../common/components/TableShimmer';

const columnsArray = [
  ['eventTime', 'positionFixTime'],
  ['type', 'sharedType'],
  ['geofenceId', 'sharedGeofence'],
  ['maintenanceId', 'sharedMaintenance'],
  ['alarm', 'positionAlarm'],
];
const columnsMap = new Map(columnsArray);

const EventReportPage = () => {
  const classes = useReportStyles();
  const t = useTranslation();

  const geofences = useSelector((state) => state.geofences.items);

  const [allEventTypes, setAllEventTypes] = useState([['allEvents', 'eventAll']]);

  const [columns, setColumns] = usePersistedState('eventColumns', ['eventTime', 'type', 'alarm']);
  const [eventTypes, setEventTypes] = useState(['allEvents']);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffectAsync(async () => {
    const response = await fetch('/api/notifications/types');
    if (response.ok) {
      const types = await response.json();
      setAllEventTypes([...allEventTypes, ...types.map((it) => [it.type, prefixString('event', it.type)])]);
    } else {
      throw Error(await response.text());
    }
  }, []);

  const handleSubmit = useCatch(async ({ deviceId, from, to, type }) => {
    const query = new URLSearchParams({ deviceId, from, to });
    eventTypes.forEach((it) => query.append('type', it));
    if (type === 'export') {
      window.location.assign(`/api/reports/events/xlsx?${query.toString()}`);
    } else if (type === 'mail') {
      const response = await fetch(`/api/reports/events/mail?${query.toString()}`);
      if (!response.ok) {
        throw Error(await response.text());
      }
    } else {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/events?${query.toString()}`, {
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          setItems(await response.json());
        } else {
          throw Error(await response.text());
        }
      } finally {
        setLoading(false);
      }
    }
  });

  const formatValue = (item, key) => {
    switch (key) {
      case 'eventTime':
        return formatTime(item[key]);
      case 'type':
        return t(prefixString('event', item[key]));
      case 'geofenceId':
        if (item[key] > 0) {
          const geofence = geofences[item[key]];
          return geofence && geofence.name;
        }
        return null;
      case 'maintenanceId':
        return item[key] > 0 ? item[key] > 0 : null;
      case 'alarm':
        return item.attributes[key] ? t(prefixString('alarm', item.attributes[key])) : null;
      default:
        return item[key];
    }
  };

  return (
    <PageLayout menu={<ReportsMenu />} breadcrumbs={['reportTitle', 'reportEvents']}>
      <div className={classes.header}>
        <ReportFilter handleSubmit={handleSubmit}>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportEventTypes')}</InputLabel>
              <Select
                label={t('reportEventTypes')}
                value={eventTypes}
                onChange={(event, child) => {
                  let values = event.target.value;
                  const clicked = child.props.value;
                  if (values.includes('allEvents') && values.length > 1) {
                    values = [clicked];
                  }
                  setEventTypes(values);
                }}
                multiple
              >
                {allEventTypes.map(([key, string]) => (
                  <MenuItem key={key} value={key}>{t(string)}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <ColumnSelect columns={columns} setColumns={setColumns} columnsArray={columnsArray} />
        </ReportFilter>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((key) => (<TableCell key={key}>{t(columnsMap.get(key))}</TableCell>))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading ? items.map((item) => (
            <TableRow key={item.id}>
              {columns.map((key) => (
                <TableCell key={key}>
                  {formatValue(item, key)}
                </TableCell>
              ))}
            </TableRow>
          )) : (<TableShimmer columns={columns.length} />)}
        </TableBody>
      </Table>
    </PageLayout>
  );
};

export default EventReportPage;
