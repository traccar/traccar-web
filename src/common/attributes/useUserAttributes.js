import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  telegramChatId: {
    name: t('attributeTelegramChatId'),
    type: 'string',
  },
  pushoverUserKey: {
    name: t('attributePushoverUserKey'),
    type: 'string',
  },
  pushoverDeviceNames: {
    name: t('attributePushoverDeviceNames'),
    type: 'string',
  },
  'mail.smtp.host': {
    name: t('attributeMailSmtpHost'),
    type: 'string',
  },
  'mail.smtp.port': {
    name: t('attributeMailSmtpPort'),
    type: 'number',
  },
  'mail.smtp.starttls.enable': {
    name: t('attributeMailSmtpStarttlsEnable'),
    type: 'boolean',
  },
  'mail.smtp.starttls.required': {
    name: t('attributeMailSmtpStarttlsRequired'),
    type: 'boolean',
  },
  'mail.smtp.ssl.enable': {
    name: t('attributeMailSmtpSslEnable'),
    type: 'boolean',
  },
  'mail.smtp.ssl.trust': {
    name: t('attributeMailSmtpSslTrust'),
    type: 'string',
  },
  'mail.smtp.ssl.protocols': {
    name: t('attributeMailSmtpSslProtocols'),
    type: 'string',
  },
  'mail.smtp.from': {
    name: t('attributeMailSmtpFrom'),
    type: 'string',
  },
  'mail.smtp.auth': {
    name: t('attributeMailSmtpAuth'),
    type: 'boolean',
  },
  'mail.smtp.username': {
    name: t('attributeMailSmtpUsername'),
    type: 'string',
  },
  'mail.smtp.password': {
    name: t('attributeMailSmtpPassword'),
    type: 'string',
  },
  termsAccepted: {
    name: t('userTermsAccepted'),
    type: 'boolean',
  },
}), [t]);
