import { useState } from 'react';
import { Link } from '@mui/material';
import { useCatch } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';

const DeviceUsersValue = ({ deviceId }) => {
  const t = useTranslation();

  const [users, setUsers] = useState();

  const loadUsers = useCatch(async () => {
    const query = new URLSearchParams({ deviceId });
    const response = await fetch(`/api/users?${query.toString()}`);
    if (response.ok) {
      setUsers(await response.json());
    } else {
      throw Error(await response.text());
    }
  });

  if (users) {
    return users.map((user) => user.name).join(', ');
  }
  return (<Link href="#" onClick={loadUsers}>{t('reportShow')}</Link>);
};

export default DeviceUsersValue;
