import React, { useState } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { useTheme } from "@material-ui/core/styles";
import { useSelector } from 'react-redux';
import { formatDate } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';
import { prefixString } from '../common/stringUtils';
import t from '../common/localization';

const Filter = ({ setItems }) => {

  const [eventTypes, setEventTypes] = useState(['allEvents']);

  const handleSubmit = async (deviceId, from, to, mail, headers) => {
    const query = new URLSearchParams({ deviceId, from, to, mail });
    eventTypes.forEach(it => query.append('type', it));
    const response = await fetch(`/api/reports/events?${query.toString()}`, { headers });
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType) {
        if (contentType === 'application/json') {
          setItems(await response.json());
        } else {
          window.location.assign(window.URL.createObjectURL(await response.blob()));
        }
      }
    }
  };

  return (
    <ReportFilter handleSubmit={handleSubmit}>
      <Grid item xs={12} sm={6}>
        <FormControl variant="filled" fullWidth>
          <InputLabel>{t('reportEventTypes')}</InputLabel>
          <Select value={eventTypes} onChange={e => setEventTypes(e.target.value)} multiple>
            <MenuItem value="allEvents">{t('eventAll')}</MenuItem>
            <MenuItem value="deviceOnline">{t('eventDeviceOnline')}</MenuItem>
            <MenuItem value="deviceUnknown">{t('eventDeviceUnknown')}</MenuItem>
            <MenuItem value="deviceOffline">{t('eventDeviceOffline')}</MenuItem>
            <MenuItem value="deviceInactive">{t('eventDeviceInactive')}</MenuItem>
            <MenuItem value="deviceMoving">{t('eventDeviceMoving')}</MenuItem>
            <MenuItem value="deviceStopped">{t('eventDeviceStopped')}</MenuItem>
            <MenuItem value="deviceOverspeed">{t('eventDeviceOverspeed')}</MenuItem>
            <MenuItem value="deviceFuelDrop">{t('eventDeviceFuelDrop')}</MenuItem>
            <MenuItem value="commandResult">{t('eventCommandResult')}</MenuItem>
            <MenuItem value="geofenceEnter">{t('eventGeofenceEnter')}</MenuItem>
            <MenuItem value="geofenceExit">{t('eventGeofenceExit')}</MenuItem>
            <MenuItem value="alarm">{t('eventAlarm')}</MenuItem>
            <MenuItem value="ignitionOn">{t('eventIgnitionOn')}</MenuItem>
            <MenuItem value="ignitionOff">{t('eventIgnitionOff')}</MenuItem>
            <MenuItem value="maintenance">{t('eventMaintenance')}</MenuItem>
            <MenuItem value="textMessage">{t('eventTextMessage')}</MenuItem>
            <MenuItem value="driverChanged">{t('eventDriverChanged')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </ReportFilter>
  );
}

const EventReportPage = () => {

  const theme = useTheme();
  const geofences = useSelector(state => state.geofences.items);
  const [items, setItems] = useState([]);

  const formatGeofence = value => {
    if (value > 0) {
        const geofence = geofences[value];
        return geofence ? geofence.name : '';
    }
    return null;
  }

  const columns = [{
    headerName: t('positionFixTime'),
    field: 'serverTime',
    type: 'dateTime',
    width: theme.dimensions.columnWidthDate,
    valueFormatter: ({ value }) => formatDate(value),
  }, {
    headerName: t('sharedType'),
    field: 'type',
    type: 'string',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => t(prefixString('event', value)),
  }, {
    headerName: t('sharedGeofence'),
    field: 'geofenceId',
    width: theme.dimensions.columnWidthString,
    valueFormatter: ({ value }) => formatGeofence(value),
  }, {
    headerName: t('sharedMaintenance'),
    field: 'maintenanceId',
    type: 'number',
    width: theme.dimensions.columnWidthString,
  }];

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <DataGrid
        rows={items} 
        columns={columns} 
        hideFooter 
        autoHeight />
    </ReportLayoutPage>
  );
}

export default EventReportPage;
