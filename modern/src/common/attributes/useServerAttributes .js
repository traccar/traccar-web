import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  disableStyles: {
    name: t('attributeUiDisableStylesAttributes'),
    type: 'string',
  },
}), [t]);
