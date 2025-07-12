import { useState } from 'react';
import { Link } from '@mui/material';
import { useCatch } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import fetchOrThrow from '../../common/util/fetchOrThrow';

const DeviceUsersValue = ({ deviceId }) => {
  const t = useTranslation();

  const [users, setUsers] = useState();

  const loadUsers = useCatch(async () => {
    const query = new URLSearchParams({ deviceId });
    const response = await fetchOrThrow(`/api/users?${query.toString()}`);
    setUsers(await response.json());
  });

  if (users) {
    return users.map((user) => user.name).join(', ');
  }
  return (<Link href="#" onClick={loadUsers}>{t('reportShow')}</Link>);
};

export default DeviceUsersValue;
