import { useSelector } from 'react-redux';

const GeofencesValue = ({ geofenceIds }) => {
  const geofences = useSelector((state) => state.geofences.items);

  return geofenceIds.map((id) => geofences[id]?.name).join(', ');
};

export default GeofencesValue;
