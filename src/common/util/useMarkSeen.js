import { useDispatch } from 'react-redux';
import { eventsActions } from '../../store';
import { useCatch } from '../../reactHelper';
import fetchOrThrow from './fetchOrThrow';

// Marks pending alerts as seen for the current user (stored on the server) and removes them
// from the pending list. Takes an array of events.
export default () => {
  const dispatch = useDispatch();
  return useCatch(async (events) => {
    if (!events.length) {
      return;
    }
    await fetchOrThrow('api/events/seen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(events.map((event) => event.id)),
    });
    events.forEach((event) => dispatch(eventsActions.delete(event)));
  });
};
