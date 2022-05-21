import React, { useState } from 'react';
import {
  TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, IconButton,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useEffectAsync } from '../reactHelper';
import EditCollectionView from './components/EditCollectionView';
import { useTranslation } from '../common/components/LocalizationProvider';
import { useAdministrator } from '../common/util/permissions';
import PageLayout from '../common/components/PageLayout';
import SettingsMenu from './components/SettingsMenu';

const useStyles = makeStyles((theme) => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const ComputedAttributeView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();
  const t = useTranslation();

  const [items, setItems] = useState([]);
  const administrator = useAdministrator();

  useEffectAsync(async () => {
    const response = await fetch('/api/attributes/computed');
    if (response.ok) {
      setItems(await response.json());
    } else {
      throw Error(await response.text());
    }
  }, [updateTimestamp]);

  return (
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
                  <IconButton size="small" onClick={(event) => onMenuClick(event.currentTarget, item.id)}>
                    <MoreVertIcon />
                  </IconButton>
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
  );
};

const ComputedAttributesPage = () => (
  <PageLayout menu={<SettingsMenu />} breadcrumbs={['settingsTitle', 'sharedComputedAttributes']}>
    <EditCollectionView content={ComputedAttributeView} editPath="/settings/attribute" endpoint="attributes/computed" />
  </PageLayout>
);

export default ComputedAttributesPage;
