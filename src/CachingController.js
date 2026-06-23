import { useDispatch, useSelector } from 'react-redux';
import {
  geofencesActions,
  groupsActions,
  driversActions,
  maintenancesActions,
  calendarsActions,
} from './store';
import { useAsyncTask } from './reactHelper';
import fetchOrThrow from './common/util/fetchOrThrow';

const CachingController = () => {
  const authenticated = useSelector((state) => !!state.session.user);
  const dispatch = useDispatch();

  useAsyncTask(
    async ({ signal }) => {
      if (authenticated) {
        const response = await fetchOrThrow('/api/geofences', { signal });
        dispatch(geofencesActions.refresh(await response.json()));
      }
    },
    [authenticated, dispatch],
  );

  useAsyncTask(
    async ({ signal }) => {
      if (authenticated) {
        const response = await fetchOrThrow('/api/groups', { signal });
        dispatch(groupsActions.refresh(await response.json()));
      }
    },
    [authenticated, dispatch],
  );

  useAsyncTask(
    async ({ signal }) => {
      if (authenticated) {
        const response = await fetchOrThrow('/api/drivers', { signal });
        dispatch(driversActions.refresh(await response.json()));
      }
    },
    [authenticated, dispatch],
  );

  useAsyncTask(
    async ({ signal }) => {
      if (authenticated) {
        const response = await fetchOrThrow('/api/maintenance', { signal });
        dispatch(maintenancesActions.refresh(await response.json()));
      }
    },
    [authenticated, dispatch],
  );

  useAsyncTask(
    async ({ signal }) => {
      if (authenticated) {
        const response = await fetchOrThrow('/api/calendars', { signal });
        dispatch(calendarsActions.refresh(await response.json()));
      }
    },
    [authenticated, dispatch],
  );

  return null;
};

export default CachingController;
