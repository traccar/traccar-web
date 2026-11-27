import { Fragment } from 'react';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';

import CollectionActions from '../settings/components/CollectionActions';
import { useRestriction } from '../common/util/permissions';

const PointsList = ({ items, onPointSelected, onReload }) => {
  const readonly = useRestriction('readonly');

  return (
    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItemButton onClick={() => onPointSelected(item.id)}>
            <ListItemText primary={item.name} />
            <CollectionActions
              itemId={item.id}
              editPath="/settings/point"
              endpoint="points"
              onReload={onReload}
              readonly={readonly}
            />
          </ListItemButton>
          {index < items.length - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </List>
  );
};

export default PointsList;
