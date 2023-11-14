import { useDispatch, useSelector, connect } from 'react-redux';
import { geofencesActions, groupsActions, driversActions, maintenancesActions, calendarsActions } from './store';
import { useEffectAsync } from './reactHelper';
import { useMobileGroupCarTypesMutation, useDeviceStatusesMutation, useMobileGroupStatusesMutation, useTransportationStatusesMutation } from './services/dictionaries';

const CachingController = () => {
  const [getMobileGroupCarTypes] = useMobileGroupCarTypesMutation();
  const [getDeviceStatuses] = useDeviceStatusesMutation();
  const [getMobileGroupStatuses] = useMobileGroupStatusesMutation();
  const [getTransportationStatuses] = useTransportationStatusesMutation();

  const authenticated = useSelector((state) => !!state.session.user);
  const axelorAuthenticated = useSelector((state) => !!state.session.axelor);
  const dispatch = useDispatch();

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/geofences');
      if (response.ok) {
        dispatch(geofencesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/groups');
      if (response.ok) {
        dispatch(groupsActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/drivers');
      if (response.ok) {
        dispatch(driversActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/maintenance');
      if (response.ok) {
        dispatch(maintenancesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/calendars');
      if (response.ok) {
        dispatch(calendarsActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (axelorAuthenticated) {
     await getMobileGroupCarTypes();
     await getDeviceStatuses()
     await getMobileGroupStatuses()
     await getTransportationStatuses()
    }
  }, [axelorAuthenticated]);

  return null;
};

export default connect()(CachingController);
