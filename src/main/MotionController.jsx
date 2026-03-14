import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { motionActions } from '../store';
import { useAttributePreference } from '../common/util/preferences';
import { useEffectAsync } from '../reactHelper';
import fetchOrThrow from '../common/util/fetchOrThrow';

const buildSegments = (events, fromTimestamp, toTimestamp) => {
  const segments = [];
  let cursor = fromTimestamp;
  const firstEvent = events.length ? events[0] : null;
  let state = 'stopped';
  if (firstEvent && firstEvent.type === 'deviceStopped') {
    state = 'moving';
  }

  events.forEach((event) => {
    const timestamp = dayjs(event.eventTime).valueOf();
    const clampedTimestamp = Math.max(fromTimestamp, Math.min(toTimestamp, timestamp));
    if (clampedTimestamp > cursor) {
      segments.push({
        type: state,
        value: clampedTimestamp - cursor,
      });
    }
    state = event.type === 'deviceMoving' ? 'moving' : 'stopped';
    cursor = clampedTimestamp;
  });

  if (toTimestamp > cursor) {
    segments.push({
      type: state,
      value: toTimestamp - cursor,
    });
  }

  if (!segments.length) {
    return [{ type: 'stopped', value: 1 }];
  }

  return segments;
};

const MotionController = () => {
  const dispatch = useDispatch();

  const deviceSecondary = useAttributePreference('deviceSecondary', '');

  useEffectAsync(async () => {
    if (deviceSecondary !== 'motion') {
      dispatch(motionActions.clear());
      return;
    }

    let active = true;

    const refreshMotion = async () => {
      const to = dayjs();
      const from = to.subtract(24, 'hour');
      const query = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      });
      query.append('type', 'deviceMoving');
      query.append('type', 'deviceStopped');

      const response = await fetchOrThrow(`/api/reports/events?${query.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      const events = await response.json();

      const groupedEvents = {};
      events.forEach((event) => {
        if (!groupedEvents[event.deviceId]) {
          groupedEvents[event.deviceId] = [];
        }
        groupedEvents[event.deviceId].push(event);
      });
      const nextMotion = Object.fromEntries(
        Object.entries(groupedEvents).map(([deviceId, deviceEvents]) => [
          deviceId,
          buildSegments(deviceEvents, from.valueOf(), to.valueOf()),
        ]),
      );

      if (active) {
        dispatch(motionActions.set(nextMotion));
      }
    };

    await refreshMotion();
    const interval = setInterval(refreshMotion, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [deviceSecondary]);

  return null;
};

export default MotionController;
