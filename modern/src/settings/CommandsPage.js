import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import { formatBoolean } from '../common/util/formatter';
import { prefixString } from '../common/util/stringUtils';
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

const CommandsPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/commands');
    if (response.ok) {
      setItems(await response.json());
    } else {
      throw Error(await response.text());
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedSavedCommands']}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.columnAction} />
              <TableCell>{t('sharedDescription')}</TableCell>
              <TableCell>{t('sharedType')}</TableCell>
              <TableCell>{t('commandSendSms')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={classes.columnAction} padding="none">
                  <CollectionActions itemId={item.id} editPath="/settings/command" endpoint="commands" setTimestamp={setTimestamp} />
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{t(prefixString('command', item.type))}</TableCell>
                <TableCell>{formatBoolean(item.textChannel, t)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CollectionFab editPath="/settings/command" />
    </PageLayout>
  );
};

export default CommandsPage;
