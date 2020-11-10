import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Button, TextField } from '@material-ui/core';
import t from '../common/localization';
import { useSelector } from 'react-redux';
import moment from 'moment';

const ReportFilter = (props) => {
  const devices = useSelector((state) => Object.values(state.devices.items));
  const [deviceId, setDeviceId] = useState();
  const [period, setPeriod] = useState('today');
  const [from, setFrom] = useState(moment().subtract(1, 'hour'));
  const [to, setTo] = useState(moment());

  const handleShow = () => {
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

    props.handleSubmit(deviceId, selectedFrom, selectedTo);
  }

  return (
    <>
      <FormControl variant="filled" margin="normal" fullWidth>
        <InputLabel>{t('reportDevice')}</InputLabel>
        <Select value={deviceId} onChange={(e) => setDeviceId(e.target.value)}>
          {devices.map((device) => (
            <MenuItem value={device.id}>{device.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {props.children}

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
          onChange={(e) =>
            setFrom(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))
          }
          fullWidth />
      )}
      {period === 'custom' && (
        <TextField
          margin="normal"
          variant="filled"
          label={t('reportTo')}
          type="datetime-local"
          value={to.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={(e) =>
            setTo(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))
          }
          fullWidth />
      )}
      <FormControl margin="normal" fullWidth>
        <Button type="button" color="primary" variant="contained" disabled={!deviceId} onClick={handleShow}>
          {t('reportShow')}
        </Button>
      </FormControl>
    </>
  );
}

export default ReportFilter;
