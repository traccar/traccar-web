import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';
import { formatAddress } from '../util/formatter';
import { usePreference, useAttributePreference } from '../util/preferences';
import fetchOrThrow from '../util/fetchOrThrow';

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const addressEnabled = useSelector((state) => state.session.server.geocoderEnabled);
  const coordinateFormat = usePreference('coordinateFormat');
  const coordinatesAddress = useAttributePreference('coordinatesAddress');

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
  const coordinates = coordinatesAddress ? t('sharedShowAddress') : formatAddress({ latitude, longitude }, coordinateFormat);
  if (addressEnabled) {
    return (
      <Link href="#" onClick={showAddress}>
        {coordinates}
      </Link>
    );
  }
  return coordinates;
};

export default AddressValue;
