import { Fragment } from 'react';
import { List, ListItemButton, ListItemText, Divider } from '@mui/material';
import CollectionActions from '../settings/components/CollectionActions';

const GeofencesList = ({ geofences = [], selectedGeofenceId, onGeofenceSelected }) => {
  return (
    <List>
      {geofences.map((item, index, list) => (
        <Fragment key={item.id}>
          <ListItemButton
            selected={item.id === selectedGeofenceId}
            onClick={() => onGeofenceSelected(item.id)}
          >
            <ListItemText primary={item.name} />
            <CollectionActions
              itemId={item.id}
              editPath="/settings/geofence"
              endpoint="geofences"
              setTimestamp={() => {}}
            />
          </ListItemButton>
          {index < list.length - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </List>
  );
};

export default GeofencesList;
