import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  disableMapLayers: {
    name: t('attributeUiDisableMapLayers'),
    type: 'string',
  },
}), [t]);
