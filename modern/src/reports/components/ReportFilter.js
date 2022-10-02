import React from 'react';
import {
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import { reportsActions } from '../../store';

const ReportFilter = ({ children, handleSubmit, showOnly, ignoreDevice, multiDevice, includeGroups }) => {
  const classes = useReportStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const deviceId = useSelector((state) => state.reports.deviceId || selectedDeviceId);
  const deviceIds = useSelector((state) => (
    state.reports.deviceIds.length
      ? state.reports.deviceIds : state.reports.deviceId
        ? [state.reports.deviceId] : selectedDeviceId
          ? [selectedDeviceId] : []
  ));
  const groupIds = useSelector((state) => state.reports.groupIds);
  const period = useSelector((state) => state.reports.period);
  const from = useSelector((state) => state.reports.from);
  const to = useSelector((state) => state.reports.to);

  const disabled = !ignoreDevice && !selectedDeviceId && !deviceId && !deviceIds.length && !groupIds.length;

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
        selectedFrom = moment(from, moment.HTML5_FMT.DATETIME_LOCAL);
        selectedTo = moment(to, moment.HTML5_FMT.DATETIME_LOCAL);
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
              onChange={(e) => dispatch(multiDevice ? reportsActions.updateDeviceIds(e.target.value) : reportsActions.updateDeviceId(e.target.value))}
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
              onChange={(e) => dispatch(reportsActions.updateGroupIds(e.target.value))}
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
          <Select label={t('reportPeriod')} value={period} onChange={(e) => dispatch(reportsActions.updatePeriod(e.target.value))}>
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
            value={from}
            onChange={(e) => dispatch(reportsActions.updateFrom(e.target.value))}
            fullWidth
          />
        </div>
      )}
      {period === 'custom' && (
        <div className={classes.filterItem}>
          <TextField
            label={t('reportTo')}
            type="datetime-local"
            value={to}
            onChange={(e) => dispatch(reportsActions.updateTo(e.target.value))}
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
