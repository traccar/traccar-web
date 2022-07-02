import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'ui.disableLoginLanguage': {
    name: t('attributeUiDisableLoginLanguage'),
    type: 'boolean',
  },
}), [t]);
