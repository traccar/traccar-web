import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { formatAddress } from '../util/formatter';
import { usePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);
  const coordinateFormat = usePreference('coordinateFormat');

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [latitude, longitude, originalAddress]);

  const showAddress = useCatch(async (event) => {
    event.preventDefault();
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetchOrThrow(`/api/server/geocode?${query.toString()}`);
    setAddress(await response.text());
  });

  if (address) {
    return address;
  }
  if (addressEnabled) {
    return (
      <Link href="#" onClick={showAddress}>
        {t('sharedShowAddress')}
      </Link>
    );
  }
  return formatAddress({ latitude, longitude }, coordinateFormat);
};

export default AddressValue;
