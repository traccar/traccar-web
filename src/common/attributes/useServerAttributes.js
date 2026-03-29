import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  support: {
    name: t('settingsSupport'),
    type: 'string',
  },
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
  logoInverted: {
    name: t('serverLogoInverted'),
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
  disableChange: {
    name: t('serverChangeDisable'),
    type: 'boolean',
  },
  darkMode: {
    name: t('settingsDarkMode'),
    type: 'boolean',
  },
  termsUrl: {
    name: t('userTerms'),
    type: 'string',
  },
  privacyUrl: {
    name: t('userPrivacy'),
    type: 'string',
  },
  totpEnable: {
    name: t('settingsTotpEnable'),
    type: 'boolean',
  },
  totpForce: {
    name: t('settingsTotpForce'),
    type: 'boolean',
  },
  serviceWorkerUpdateInterval: {
    name: t('settingsServiceWorkerUpdateInterval'),
    type: 'number',
  },
  'ui.disableLoginLanguage': {
    name: t('attributeUiDisableLoginLanguage'),
    type: 'boolean',
  },
  disableShare: {
    name: t('serverDisableShare'),
    type: 'boolean',
  },
}), [t]);
