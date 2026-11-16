import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// Alarm events received in this session and not yet acknowledged, grouped by device id
// (newest first). Acknowledging an alarm removes its event from the events store.
export default () => {
  const events = useSelector((state) => state.events.items);
  return useMemo(() => {
    const result = {};
    events
      .filter((event) => event.type === 'alarm')
      .forEach((event) => {
        (result[event.deviceId] ||= []).push(event);
      });
    return result;
  }, [events]);
};
