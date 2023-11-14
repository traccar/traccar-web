import { useDispatch, useSelector, connect } from 'react-redux';
import { sessionActions } from './store';
import { http } from './services/AxelorFetchService';
import { useEffectAsync } from './reactHelper';

const AxelorAuthController = () => {
  const authenticated = useSelector((state) => !!state.session.user);
  const dispatch = useDispatch();

  const user = { username: 'admin', password: 'Admin2023' };

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/users/axelor', {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa('admin:traccar2023')}` },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();

        http.initAuthHeaders({ ...data, TOKEN: btoa(`${user.username}:${user.password}`) });

        dispatch(sessionActions.updateAxelor(data));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  return null;
};

export default connect()(AxelorAuthController);
