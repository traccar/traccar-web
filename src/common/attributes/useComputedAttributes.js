import { useEffect, useState } from 'react';
import fetchOrThrow from '../util/fetchOrThrow';

export default () => {
  const [descriptions, setDescriptions] = useState({});

  useEffect(() => {
    fetchOrThrow('/api/attributes/computed')
      .then((response) => response.json())
      .then((items) => {
        const map = {};
        items.forEach((item) => {
          if (item.description && item.attribute) {
            map[item.attribute] = item.description;
          }
        });
        setDescriptions(map);
      })
      .catch(() => {});
  }, []);

  return descriptions;
};
