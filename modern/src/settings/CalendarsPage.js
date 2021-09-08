import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, IconButton,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useEffectAsync } from '../reactHelper';
import EditCollectionView from '../EditCollectionView';
import OptionsLayout from './OptionsLayout';
import { useTranslation } from '../LocalizationProvider';

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const CalendarsView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();
  const t = useTranslation();

  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/calendars');
    if (response.ok) {
      setItems(await response.json());
    }
  }, [updateTimestamp]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.columnAction} />
            <TableCell>{t('sharedName')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={classes.columnAction} padding="none">
                <IconButton onClick={(event) => onMenuClick(event.currentTarget, item.id)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
              <TableCell>{item.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const CalendarsPage = () => (
  <OptionsLayout>
    <EditCollectionView content={CalendarsView} editPath="/settings/calendar" endpoint="calendars" />
  </OptionsLayout>
);

export default CalendarsPage;
