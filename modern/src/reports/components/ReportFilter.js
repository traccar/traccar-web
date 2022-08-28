import React, { useState } from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';

const ReportFilter = ({ children, handleSubmit, showOnly, ignoreDevice, multiDevice, includeGroups }) => {
  const classes = useReportStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [deviceId, setDeviceId] = useState(selectedDeviceId);
  const [deviceIds, setDeviceIds] = useState(selectedDeviceId ? [selectedDeviceId] : []);
  const [groupIds, setGroupIds] = useState([]);
  const [period, setPeriod] = useState('today');
  const [from, setFrom] = useState(moment().subtract(1, 'hour'));
  const [to, setTo] = useState(moment());

  const disabled = !ignoreDevice && !deviceId && !deviceIds.length && !groupIds.length;

  const handleClick = (type) => {
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

    handleSubmit({
      deviceId,
      deviceIds,
      groupIds,
      from: selectedFrom.toISOString(),
      to: selectedTo.toISOString(),
      type,
    });
  };

  return (
    <div className={classes.filter}>
      {!ignoreDevice && (
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t(multiDevice ? 'deviceTitle' : 'reportDevice')}</InputLabel>
            <Select
              label={t(multiDevice ? 'deviceTitle' : 'reportDevice')}
              value={multiDevice ? deviceIds : deviceId || ''}
              onChange={(e) => (multiDevice ? setDeviceIds(e.target.value) : setDeviceId(e.target.value))}
              multiple={multiDevice}
            >
              {Object.values(devices).sort((a, b) => a.name.localeCompare(b.name)).map((device) => (
                <MenuItem key={device.id} value={device.id}>{device.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      {includeGroups && (
        <div className={classes.filterItem}>
          <FormControl fullWidth>
            <InputLabel>{t('settingsGroups')}</InputLabel>
            <Select
              label={t('settingsGroups')}
              value={groupIds}
              onChange={(e) => setGroupIds(e.target.value)}
              multiple
            >
              {Object.values(groups).sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
                <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
      <div className={classes.filterItem}>
        <FormControl fullWidth>
          <InputLabel>{t('reportPeriod')}</InputLabel>
          <Select label={t('reportPeriod')} value={period} onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="today">{t('reportToday')}</MenuItem>
            <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
            <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
            <MenuItem value="previousWeek">{t('reportPreviousWeek')}</MenuItem>
            <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
            <MenuItem value="previousMonth">{t('reportPreviousMonth')}</MenuItem>
            <MenuItem value="custom">{t('reportCustom')}</MenuItem>
          </Select>
        </FormControl>
      </div>
      {period === 'custom' && (
        <div className={classes.filterItem}>
          <TextField
            label={t('reportFrom')}
            type="datetime-local"
            value={from.locale('en').format(moment.HTML5_FMT.DATETIME_LOCAL)}
            onChange={(e) => setFrom(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
            fullWidth
          />
        </div>
      )}
      {period === 'custom' && (
        <div className={classes.filterItem}>
          <TextField
            label={t('reportTo')}
            type="datetime-local"
            value={to.locale('en').format(moment.HTML5_FMT.DATETIME_LOCAL)}
            onChange={(e) => setTo(moment(e.target.value, moment.HTML5_FMT.DATETIME_LOCAL))}
            fullWidth
          />
        </div>
      )}
      {children}
      <div className={classes.filterButtons}>
        <Button
          onClick={() => handleClick('json')}
          variant="outlined"
          color="secondary"
          className={classes.filterButton}
          disabled={disabled}
        >
          {t('reportShow')}
        </Button>
        {!showOnly && (
          <Button
            onClick={() => handleClick('export')}
            variant="outlined"
            color="secondary"
            className={classes.filterButton}
            disabled={disabled}
          >
            {t('reportExport')}
          </Button>
        )}
        {!showOnly && (
          <Button
            onClick={() => handleClick('mail')}
            variant="outlined"
            color="secondary"
            className={classes.filterButton}
            disabled={disabled}
          >
            <Typography variant="button" noWrap>{t('reportEmail')}</Typography>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
