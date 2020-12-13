import React, { useState } from 'react';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper } from '@material-ui/core';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import t from '../common/localization';
import { formatPosition } from '../common/formatter';
import ReportFilter from './ReportFilter';
import ReportLayoutPage from './ReportLayoutPage';

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
      <FormControl variant="filled" margin="normal" fullWidth>
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
    </ReportFilter>
  );
}

const EventReportPage = () => {

  const [items, setItems] = useState([]);

  return (
    <ReportLayoutPage filter={<Filter setItems={setItems} />}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('positionFixTime')}</TableCell>
              <TableCell>{t('sharedType')}</TableCell>
              <TableCell>{t('sharedGeofence')}</TableCell>
              <TableCell>{t('sharedMaintenance')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{formatPosition(item, 'serverTime')}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{}</TableCell>
                <TableCell>{}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ReportLayoutPage>
  );
}

export default EventReportPage;
