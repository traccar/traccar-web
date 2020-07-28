import moment from 'moment';

const formatValue = (key, value) => {
  switch (key) {
    case 'fixTime':
    case 'startTime':
    case 'endTime':
      return moment(value).format('LLL');
    case 'latitude':
    case 'longitude':
      return value.toFixed(5);
    case 'speed':
    case 'averageSpeed':
    case 'maxSpeed':
      return value.toFixed(1);
    default:
      return value;
  }
}

export default (object, key) => {
  if (object != null && typeof object == 'object') {
    return formatValue(key, object[key]);
  } else {
    return formatValue(key, object);
  }
};
