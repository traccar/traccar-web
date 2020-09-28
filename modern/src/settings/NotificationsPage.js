import React, { useState } from 'react';
import MainToolbar from '../MainToolbar';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import t from '../common/localization';
import { useEffectAsync } from '../reactHelper';
import EditCollectionView from '../EditCollectionView';
import { prefixString } from '../common/stringUtils';
import { formatBoolean } from '../common/formatter';

const useStyles = makeStyles(theme => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const NotificationsView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();

  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/notifications');
    if (response.ok) {
      setItems(await response.json());
    }
  }, [updateTimestamp]);

  const formatList = (prefix, value) => {
    if (value) {
      return value
        .split(/[, ]+/)
        .filter(Boolean)
        .map(it => t(prefixString(prefix, it)))
        .join(', ');
    }
    return '';
  };

  return (
    <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.columnAction} />
          <TableCell>{t('notificationType')}</TableCell>
          <TableCell>{t('notificationAlways')}</TableCell>
          <TableCell>{t('sharedAlarms')}</TableCell>
          <TableCell>{t('notificationNotificators')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell className={classes.columnAction} padding="none">
              <IconButton onClick={(event) => onMenuClick(event.currentTarget, item.id)}>
                <MoreVertIcon />
              </IconButton>
            </TableCell>
            <TableCell>{t(prefixString('event', item.type))}</TableCell>
            <TableCell>{formatBoolean(item.always)}</TableCell>
            <TableCell>{formatList('alarm', item.attributes.alarms)}</TableCell>
            <TableCell>{formatList('notificator', item.notificators)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
  );
}

const NotificationsPage = () => {
  return (
    <>
      <MainToolbar />
      <EditCollectionView content={NotificationsView} editPath="/settings/notification" endpoint="notifications" />
    </>
  );
}

export default NotificationsPage;
