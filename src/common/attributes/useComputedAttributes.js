import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default () => {
  const items = useSelector((state) => state.computedAttributes.items);

  return useMemo(() => {
    const map = {};
    Object.values(items).forEach((item) => {
      if (item.description && item.attribute) {
        map[item.attribute] = item.description;
      }
    });
    return map;
  }, [items]);
};
