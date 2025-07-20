import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FormControl, InputLabel, Select, MenuItem, Button, TextField, Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useRestriction } from '../../common/util/permissions';

const ReportFilter = ({
  children, handleSubmit, handleSchedule, showOnly, deviceType, loading,
}) => {
  const { classes } = useReportStyles();
  const t = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const readonly = useRestriction('readonly');

  const devices = useSelector((state) => state.devices.items);
  const groups = useSelector((state) => state.groups.items);

  const deviceIds = useMemo(() => searchParams.getAll('deviceId').map(Number), [searchParams]);
  const groupIds = useMemo(() => searchParams.getAll('groupId').map(Number), [searchParams]);
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const [period, setPeriod] = useState('today');
  const [customFrom, setCustomFrom] = useState(dayjs().subtract(1, 'hour').locale('en').format('YYYY-MM-DDTHH:mm'));
  const [customTo, setCustomTo] = useState(dayjs().locale('en').format('YYYY-MM-DDTHH:mm'));
  const [button, setButton] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const scheduleDisabled = button === 'schedule' && (!description || !calendarId);
  const disabled = (deviceType !== 'none' && !deviceIds.length && !groupIds.length) || scheduleDisabled || loading;

  useEffect(() => {
    if (from && to) {
      handleSubmit({ deviceIds, groupIds, from, to, type: 'json' });
    }
  }, [deviceIds, groupIds, from, to]);

  const handleReport = () => {
    let selectedFrom;
    let selectedTo;
    switch (period) {
      case 'today':
        selectedFrom = dayjs().startOf('day');
        selectedTo = dayjs().endOf('day');
        break;
      case 'yesterday':
        selectedFrom = dayjs().subtract(1, 'day').startOf('day');
        selectedTo = dayjs().subtract(1, 'day').endOf('day');
        break;
      case 'thisWeek':
        selectedFrom = dayjs().startOf('week');
        selectedTo = dayjs().endOf('week');
        break;
      case 'previousWeek':
        selectedFrom = dayjs().subtract(1, 'week').startOf('week');
        selectedTo = dayjs().subtract(1, 'week').endOf('week');
        break;
      case 'thisMonth':
        selectedFrom = dayjs().startOf('month');
        selectedTo = dayjs().endOf('month');
        break;
      case 'previousMonth':
        selectedFrom = dayjs().subtract(1, 'month').startOf('month');
        selectedTo = dayjs().subtract(1, 'month').endOf('month');
        break;
      default:
        selectedFrom = dayjs(customFrom, 'YYYY-MM-DDTHH:mm');
        selectedTo = dayjs(customTo, 'YYYY-MM-DDTHH:mm');
        break;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set('from', selectedFrom.toISOString());
    newParams.set('to', selectedTo.toISOString());
    setSearchParams(newParams, { replace: true });
  };

  const updateParams = (key, values) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    newParams.delete('from');
    newParams.delete('to');
    values.forEach((id) => newParams.append(key, id));
    setSearchParams(newParams, { replace: true });
  }

  return (
    <div className={classes.filter}>
      {deviceType !== 'none' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t(deviceType === 'multiple' ? 'deviceTitle' : 'reportDevice')}
            data={Object.values(devices).sort((a, b) => a.name.localeCompare(b.name))}
            value={deviceType === 'multiple' ? deviceIds : deviceIds.find(() => true)}
            onChange={(e) => updateParams('deviceId', deviceType === 'multiple' ? e.target.value : [e.target.value].filter((id) => id))}
            multiple={deviceType === 'multiple'}
            fullWidth
          />
        </div>
      )}
      {deviceType === 'multiple' && (
        <div className={classes.filterItem}>
          <SelectField
            label={t('settingsGroups')}
            data={Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))}
            value={groupIds}
            onChange={(e) => updateParams('deviceId', e.target.value)}
            multiple
            fullWidth
          />
        </div>
      )}
      {button !== 'schedule' ? (
        <>
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
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                fullWidth
              />
            </div>
          )}
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportTo')}
                type="datetime-local"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                fullWidth
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className={classes.filterItem}>
            <TextField
              value={description || ''}
              onChange={(event) => setDescription(event.target.value)}
              label={t('sharedDescription')}
              fullWidth
            />
          </div>
          <div className={classes.filterItem}>
            <SelectField
              value={calendarId}
              onChange={(event) => setCalendarId(Number(event.target.value))}
              endpoint="/api/calendars"
              label={t('sharedCalendar')}
              fullWidth
            />
          </div>
        </>
      )}
      {children}
      <div className={classes.filterItem}>
        {showOnly ? (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={() => handleReport('json')}
          >
            <Typography variant="button" noWrap>{t(loading ? 'sharedLoading' : 'reportShow')}</Typography>
          </Button>
        ) : (
          <SplitButton
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={(type) => {
              if (type === 'schedule') {
                handleSchedule(deviceIds, groupIds, {
                  description,
                  calendarId,
                  attributes: {},
                });
              } else {
                handleReport(type);
              }
            }}
            selected={button}
            setSelected={(value) => setButton(value)}
            options={readonly ? {
              json: t('reportShow'),
              export: t('reportExport'),
              mail: t('reportEmail'),
            } : {
              json: t('reportShow'),
              export: t('reportExport'),
              mail: t('reportEmail'),
              schedule: t('reportSchedule'),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReportFilter;
