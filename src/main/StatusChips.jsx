import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useTranslation } from '../common/components/LocalizationProvider';
import { deviceStates, formatDeviceState, getDeviceState } from '../common/util/deviceState';
import useOpenAlarms from '../common/util/useOpenAlarms';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(0, 2, 1.5),
  },
  count: {
    opacity: 0.75,
    marginLeft: theme.spacing(0.5),
  },
}));

const StatusChips = ({ filter, setFilter }) => {
  const { classes } = useStyles();
  const t = useTranslation();

  const devices = useSelector((state) => state.devices.items);
  const positions = useSelector((state) => state.session.positions);
  const openAlarms = useOpenAlarms();

  const counts = useMemo(() => {
    const result = Object.fromEntries(deviceStates.map((state) => [state, 0]));
    Object.values(devices).forEach((device) => {
      result[getDeviceState(device, positions[device.id], !!openAlarms[device.id])] += 1;
    });
    return result;
  }, [devices, positions, openAlarms]);

  const selected = filter.states?.[0] || '';
  const select = (state) =>
    setFilter({ ...filter, states: state && state !== selected ? [state] : [] });

  const options = [
    { state: '', label: t('sharedAll'), count: Object.keys(devices).length },
    ...['moving', 'stopped', 'offline', 'alarm'].map((state) => ({
      state,
      label: formatDeviceState(state, t),
      count: counts[state],
    })),
  ];

  return (
    <div className={classes.root} role="group" aria-label={t('deviceStatus')}>
      {options.map(({ state, label, count }) => {
        const active = selected === state;
        return (
          <Chip
            key={state || 'all'}
            label={
              <>
                {label}
                <span className={classes.count}>{count}</span>
              </>
            }
            onClick={() => select(state)}
            aria-pressed={active}
            color={active ? 'secondary' : 'default'}
            variant={active ? 'filled' : 'outlined'}
            size="small"
          />
        );
      })}
    </div>
  );
};

export default StatusChips;
