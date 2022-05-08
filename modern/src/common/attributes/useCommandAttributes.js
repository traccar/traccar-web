import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  custom: [
    {
      key: 'data',
      name: t('commandData'),
      type: 'string',
    },
  ],
}), [t]);
