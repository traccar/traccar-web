import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button, Drawer, IconButton, List, ListItem, ListItemText, Toolbar, Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from '../common/components/LocalizationProvider';
import { eventsActions } from '../store';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.dimensions.eventsDrawerWidth,
  },
  header: {
    flexGrow: 1,
  },
}));

const EventsDrawer = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const events = useSelector((state) => state.events.items);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Toolbar>
        <Typography variant="h6" className={classes.header}>
          {t('reportEvents')}
        </Typography>
        <Button color="inherit" onClick={() => dispatch(eventsActions.deleteAll())}>
          {t('reportClear')}
        </Button>
      </Toolbar>
      <List className={classes.drawer} dense>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText primary={event.attributes.message} />
            <IconButton size="small" onClick={() => dispatch(eventsActions.delete(event))}>
              <DeleteIcon fontSize="small" className={classes.negative} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default EventsDrawer;
