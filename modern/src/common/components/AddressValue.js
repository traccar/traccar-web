import React, { useEffect, useState } from 'react';
import { Link } from '@mui/material';
import { useTranslation } from './LocalizationProvider';
import { useCatch } from '../../reactHelper';

const AddressValue = ({ latitude, longitude, originalAddress }) => {
  const t = useTranslation();

  const [address, setAddress] = useState();

  useEffect(() => {
    setAddress(originalAddress);
  }, [originalAddress]);

  const showAddress = useCatch(async () => {
    const query = new URLSearchParams({ latitude, longitude });
    const response = await fetch(`/api/server/geocode?${query.toString()}`);
    if (response.ok) {
      setAddress(await response.text());
    } else {
      throw Error(await response.text());
    }
  });

  if (address) {
    return address;
  }
  return (<Link href="#" onClick={showAddress}>{t('sharedShowAddress')}</Link>);
};

export default AddressValue;
