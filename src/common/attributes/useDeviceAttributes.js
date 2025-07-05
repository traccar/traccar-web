import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'command.sender': {
    name: t('deviceCommandSender'),
    type: 'string',
  },
  'web.reportColor': {
    name: t('attributeWebReportColor'),
    type: 'string',
    subtype: 'color',
  },
  devicePassword: {
    name: t('attributeDevicePassword'),
    type: 'string',
  },
  deviceImage: {
    name: t('attributeDeviceImage'),
    type: 'string',
  },
  'processing.copyAttributes': {
    name: t('attributeProcessingCopyAttributes'),
    type: 'string',
  },
  'decoder.timezone': {
    name: t('sharedTimezone'),
    type: 'string',
  },
  'forward.url': {
    name: t('attributeForwardUrl'),
    type: 'string',
  },
}), [t]);
