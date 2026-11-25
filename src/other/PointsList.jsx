import { Fragment } from 'react';
import { Divider, List, ListItemButton, ListItemText } from '@mui/material';

const PointsList = ({ items, onPointSelected }) => {
  return (
    <List sx={{ flexGrow: 1, overflow: 'auto' }}>
      {items.map((item, index) => (
        <Fragment key={item.id}>
          <ListItemButton onClick={() => onPointSelected(item.id)}>
            <ListItemText primary={item.name} />
          </ListItemButton>
          {index < items.length - 1 ? <Divider /> : null}
        </Fragment>
      ))}
    </List>
  );
};

export default PointsList;
