import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@material-ui/core';
import t from '../common/localization';
import { useSelector } from 'react-redux';
import moment from 'moment';

const FilterForm = ({ deviceId, setDeviceId, from, setFrom, to, setTo }) => {
  const devices = useSelector(state => Object.values(state.devices.items));

  const [period, setPeriod] = useState('today');

  useEffect(() => {
    switch (period) {
      default:
      case 'today':
        setFrom(moment().startOf('day'));
        setTo(moment().endOf('day'));
        break;
      case 'yesterday':
        setFrom(moment().subtract(1, 'day').startOf('day'));
        setTo(moment().subtract(1, 'day').endOf('day'));
        break;
      case 'thisWeek':
        setFrom(moment().startOf('week'));
        setTo(moment().endOf('week'));
        break;
      case 'previousWeek':
        setFrom(moment().subtract(1, 'week').startOf('week'));
        setTo(moment().subtract(1, 'week').endOf('week'));
        break;
      case 'thisMonth':
        setFrom(moment().startOf('month'));
        setTo(moment().endOf('month'));
        break;
      case 'previousMonth':
        setFrom(moment().subtract(1, 'month').startOf('month'));
        setTo(moment().subtract(1, 'month').endOf('month'));
        break;
    }
  }, [period, setFrom, setTo]);

  return (
    <>
      <FormControl variant='filled' margin='normal' fullWidth>
        <InputLabel>{t('reportDevice')}</InputLabel>
        <Select value={deviceId || ''} onChange={e => setDeviceId(e.target.value)}>
          {devices.map((device) => (
            <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant='filled' margin='normal' fullWidth>
        <InputLabel>{t('reportPeriod')}</InputLabel>
        <Select value={period} onChange={e => setPeriod(e.target.value)}>
          <MenuItem key='today' value='today'>{t('reportToday')}</MenuItem>
          <MenuItem key='yesterday' value='yesterday'>{t('reportYesterday')}</MenuItem>
          <MenuItem key='thisWeek' value='thisWeek'>{t('reportThisWeek')}</MenuItem>
          <MenuItem key='previousWeek' value='previousWeek'>{t('reportPreviousWeek')}</MenuItem>
          <MenuItem key='thisMonth' value='thisMonth'>{t('reportThisMonth')}</MenuItem>
          <MenuItem key='previousMonth' value='previousMonth'>{t('reportPreviousMonth')}</MenuItem>
          <MenuItem key='custom' value='custom'>{t('reportCustom')}</MenuItem>
        </Select>
      </FormControl>
      {period === 'custom' &&
        <TextField
          margin='normal'
          variant='filled'
          label={t('reportFrom')}
          type='datetime-local'
          value={from.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={e => setFrom(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth />
      }
      {period === 'custom' &&
        <TextField
          margin='normal'
          variant='filled'
          label={t('reportTo')}
          type='datetime-local'
          value={to.format(moment.HTML5_FMT.DATETIME_LOCAL)}
          onChange={(e) => setTo(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
          fullWidth />
      }
    </>
  );
}

export default FilterForm;
