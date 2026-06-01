import { useState } from 'react';
import { Link } from '@mui/material';
import { useCatch } from '../../reactHelper';
import { useTranslation } from '../../common/components/LocalizationProvider';
import fetchOrThrow from '../../common/util/fetchOrThrow';

const UserDevicesValue = ({ userId }) => {
  const t = useTranslation();

  const [devices, setDevices] = useState();

  const loadDevices = useCatch(async () => {
    const query = new URLSearchParams({ userId });
    const response = await fetchOrThrow(`/api/devices?${query.toString()}`);
    setDevices(await response.json());
  });

  if (devices) {
    return devices.length;
  }
  return (
    <Link href="#" onClick={loadDevices}>
      {t('reportShow')}
    </Link>
  );
};

export default UserDevicesValue;
