import { Link } from '@mui/material';
import { formatNumber, formatSpeed } from '../../common/util/formatter';
import { prefixString } from '../../common/util/stringUtils';

const formatEventData = (event, { deviceUniqueId, speedUnit, t }) => {
  switch (event.type) {
    case 'alarm':
      return t(prefixString('alarm', event.attributes.alarm));
    case 'deviceOverspeed':
      return formatSpeed(event.attributes.speed, speedUnit, t);
    case 'driverChanged':
      return event.attributes.driverUniqueId;
    case 'deviceFuelDrop':
    case 'deviceFuelIncrease':
      return formatNumber(Math.abs(event.attributes.after - event.attributes.before));
    case 'media':
      return (
        <Link href={`/api/media/${deviceUniqueId}/${event.attributes.file}`} target="_blank">
          {event.attributes.file}
        </Link>
      );
    case 'commandResult':
      return event.attributes.result;
    default:
      return '';
  }
};

export default formatEventData;
