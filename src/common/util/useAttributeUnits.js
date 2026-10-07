import { useMemo } from 'react';
import { useAttributePreference } from './preferences';

export default () => {
  const altitudeUnit = useAttributePreference('altitudeUnit');
  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');
  const volumeUnit = useAttributePreference('volumeUnit');
  return useMemo(
    () => ({ altitudeUnit, distanceUnit, speedUnit, volumeUnit }),
    [altitudeUnit, distanceUnit, speedUnit, volumeUnit],
  );
};
