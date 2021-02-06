import t from '../common/localization'

export default {
  'raw': {
    name: t('positionRaw'),
    type: 'string',
  },
  'index': {
    name: t('positionIndex'),
    type: 'number',
  },
  'ignition': {
    name: t('positionIgnition'),
    type: 'boolean',
  },
  'serviceOdometer': {
    name: t('positionServiceOdometer'),
    type: 'number',
    dataType: 'distance',
  },
};
