import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles,
} from '@material-ui/core';
import { useEffectAsync } from '../reactHelper';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
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

const ComputedAttributesPage = () => {
  const classes = useStyles();
  const t = useTranslation();

  const [timestamp, setTimestamp] = useState(Date.now());
  const [items, setItems] = useState([]);
  const administrator = useAdministrator();

  useEffectAsync(async () => {
    const response = await fetch('/api/attributes/computed');
    if (response.ok) {
      setItems(await response.json());
    } else {
      throw Error(await response.text());
    }
  }, [timestamp]);

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedComputedAttributes']}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {administrator && <TableCell className={classes.columnAction} />}
              <TableCell>{t('sharedDescription')}</TableCell>
              <TableCell>{t('sharedAttribute')}</TableCell>
              <TableCell>{t('sharedExpression')}</TableCell>
              <TableCell>{t('sharedType')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {administrator && (
                  <TableCell className={classes.columnAction} padding="none">
                    <CollectionActions itemId={item.id} editPath="/settings/attribute" endpoint="attributes/computed" setTimestamp={setTimestamp} />
                  </TableCell>
                )}
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.attribute}</TableCell>
                <TableCell>{item.expression}</TableCell>
                <TableCell>{item.type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CollectionFab editPath="/settings/attribute" />
    </PageLayout>
  );
};

export default ComputedAttributesPage;
