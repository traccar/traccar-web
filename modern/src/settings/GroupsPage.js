import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles,
} from '@material-ui/core';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';
import CollectionFab from './components/CollectionFab';
import CollectionActions from './components/CollectionActions';

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const GroupsPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/groups');
    if (response.ok) {
      setItems(await response.json());
    } else {
      throw Error(await response.text());
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'settingsGroups']}>
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
                  <CollectionActions itemId={item.id} editPath="/settings/group" endpoint="groups" setTimestamp={setTimestamp} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CollectionFab editPath="/settings/group" />
    </PageLayout>
  );
};

export default GroupsPage;
