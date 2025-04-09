import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useTranslation } from '../../common/components/LocalizationProvider';
import useReportStyles from '../common/useReportStyles';
import { catchActions } from '../../store';
import SplitButton from '../../common/components/SplitButton';
import SelectField from '../../common/components/SelectField';
import { useRestriction } from '../../common/util/permissions';

const CatchFilter = ({
  children,
  handleSubmit,
  showOnly,
  initialCatchList,
}) => {
  const classes = useReportStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction('readonly');

  const catches = useSelector((state) => state.catch.items);
  const filters = useSelector((state) => state.catch.filters);
  const period = useSelector((state) => state.catch.period);

  const [button, setButton] = useState('json');

  const [description, setDescription] = useState();
  const [calendarId, setCalendarId] = useState();

  const disabled =
    (!filters?.vesselIds && !filters?.vesselIds?.length) ||
    (!filters?.speciesIds && !filters?.speciesIds?.length) ||
    !filters?.from ||
    !filters?.to;
  const [vesselsList, setVesselsList] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    let tempVessels = [];
    let tempSpecies = [];

    initialCatchList?.map((item) =>
      tempVessels.push({ name: item.vesselName, id: item.vesselId })
    );
    initialCatchList?.map((item) =>
      Object.keys(item?.catchDetails)?.map((element) =>
        tempSpecies.push({
          name: item?.catchDetails[element].species_name,
          id: item?.catchDetails[element].species_name,
        })
      )
    );
    const species = getDistinctValues(tempSpecies, 'id');
    const vessels = getDistinctValues(tempVessels, 'id');
    setSpeciesList(species);
    setVesselsList(vessels);
  }, [initialCatchList]);

  const getDistinctValues = (array, key) => {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  };

  const handleClick = (type) => {
    handleSubmit({
      filters,
      type,
    });
  };

  const setDateValue = (period) => {
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
        selectedFrom = dayjs(filters?.from, 'YYYY-MM-DDTHH:mm');
        selectedTo = dayjs(filters?.to, 'YYYY-MM-DDTHH:mm');
        break;
    }
    dispatch(
      catchActions.setFilters({
        ...filters,
        from: selectedFrom.format('YYYY-MM-DDTHH:mm'),
        to: selectedTo.format('YYYY-MM-DDTHH:mm'),
      })
    );
  }

  return (
    <div className={classes.filter}>
      <div className={classes.filterItem}>
        <SelectField
          label={t('deviceTitle')}
          data={Object.values(vesselsList).sort((a, b) =>
            a.name.localeCompare(b.name)
          )}
          value={filters?.vesselIds || []}
          onChange={(e) =>
            dispatch(
              catchActions.setFilters({ ...filters, vesselIds: e.target.value })
            )
          }
          multiple={true}
          fullWidth
        />
      </div>
      <div className={classes.filterItem}>
        <SelectField
          label={t('speciesTitle')}
          data={Object.values(speciesList).sort((a, b) =>
            a.name.localeCompare(b.name)
          )}
          value={filters?.speciesIds || []}
          onChange={(e) =>
            dispatch(
              catchActions.setFilters({
                ...filters,
                speciesIds: e.target.value,
              })
            )
          }
          multiple={true}
          fullWidth
        />
      </div>

      {button !== 'schedule' ? (
        <>
          <div className={classes.filterItem}>
            <FormControl fullWidth>
              <InputLabel>{t('reportPeriod')}</InputLabel>
              <Select
                label={t('reportPeriod')}
                value={period}
                onChange={(e) => {
                  dispatch(catchActions.updatePeriod(e.target.value));
                  setDateValue(e.target.value);
                }}
              >
                <MenuItem value="today">{t('reportToday')}</MenuItem>
                <MenuItem value="yesterday">{t('reportYesterday')}</MenuItem>
                <MenuItem value="thisWeek">{t('reportThisWeek')}</MenuItem>
                <MenuItem value="previousWeek">
                  {t('reportPreviousWeek')}
                </MenuItem>
                <MenuItem value="thisMonth">{t('reportThisMonth')}</MenuItem>
                <MenuItem value="previousMonth">
                  {t('reportPreviousMonth')}
                </MenuItem>
                <MenuItem value="custom">{t('reportCustom')}</MenuItem>
              </Select>
            </FormControl>
          </div>
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportFrom')}
                type="datetime-local"
                value={filters?.from}
                onChange={(e) =>
                  dispatch(
                    catchActions.setFilters({
                      ...filters,
                      from: e.target.value,
                    })
                  )
                }
                fullWidth
              />
            </div>
          )}
          {period === 'custom' && (
            <div className={classes.filterItem}>
              <TextField
                label={t('reportTo')}
                type="datetime-local"
                value={filters?.to}
                onChange={(e) => {
                  dispatch(
                    catchActions.setFilters({ ...filters, to: e.target.value })
                  );
                }}
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
            onClick={() => handleClick('json')}
          >
            <Typography variant="button" noWrap>
              {t('reportShow')}
            </Typography>
          </Button>
        ) : (
          <SplitButton
            fullWidth
            variant="outlined"
            color="secondary"
            disabled={disabled}
            onClick={() => handleClick(button)}
            selected={button}
            setSelected={(value) => setButton(value)}
            options={
              readonly
                ? {
                    json: t('reportShow'),
                    export: t('reportExport'),
                  }
                : {
                    json: t('reportShow'),
                    export: t('reportExport'),
                  }
            }
          />
        )}
      </div>
    </div>
  );
};

export default CatchFilter;
