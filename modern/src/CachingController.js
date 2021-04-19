import {  useDispatch, useSelector } from 'react-redux';
import { connect } from 'react-redux';
import { geofencesActions } from './store';
import { useEffectAsync } from './reactHelper';

const CachingController = () => {
  const authenticated = useSelector(state => !!state.session.user);
  const dispatch = useDispatch();

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/geofences');
      if (response.ok) {
        dispatch(geofencesActions.update(await response.json()));
      }
    }
  }, [authenticated]);
  
  return null;
}

export default connect()(CachingController);
