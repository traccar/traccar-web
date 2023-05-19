import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  title: {
    name: t('serverName'),
    type: 'string',
  },
  description: {
    name: t('serverDescription'),
    type: 'string',
  },
  logo: {
    name: t('serverLogo'),
    type: 'string',
  },
  colorPrimary: {
    name: t('serverColorPrimary'),
    type: 'string',
    subtype: 'color',
  },
  colorSecondary: {
    name: t('serverColorSecondary'),
    type: 'string',
    subtype: 'color',
  },
  'ui.disableLoginLanguage': {
    name: t('attributeUiDisableLoginLanguage'),
    type: 'boolean',
  },
}), [t]);
