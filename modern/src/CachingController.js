import { useDispatch, useSelector, connect } from 'react-redux';

import {
  geofencesActions, groupsActions, driversActions, maintenancesActions, calendarsActions, mobileStatusesActions,
  transportationStatusesActions, deviceStatusesActions, carsActions
} from './store';
import { useEffectAsync } from './reactHelper';

const CachingController = () => {
  const authenticated = useSelector((state) => !!state.session.user);
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

  // TODO: Надо проверить не на authenticated traccar, а на наличие authenticated axelor
  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/axelor-api/ws/selection/ens.mobile.group.status.select', {
        method: 'POST',
        body: JSON.stringify({ translate: true }),
      });
      if (response.ok) {
        dispatch(mobileStatusesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/axelor-api/ws/selection/ens.transportation.status.select', {
        method: 'POST',
        body: JSON.stringify({ translate: true }),
      });
      if (response.ok) {
        dispatch(transportationStatusesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/axelor-api/ws/selection/ens.status.select', {
        method: 'POST',
        body: JSON.stringify({ translate: true }),
      });
      if (response.ok) {
        dispatch(deviceStatusesActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/axelor-api/ws/selection/ens.mobile.group.car.model.select', {
        method: 'POST',
        body: JSON.stringify({ translate: true }),
      });
      if (response.ok) {
        dispatch(carsActions.update(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  return null;
};

export default connect()(CachingController);
