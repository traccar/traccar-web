import React, { useState } from 'react';
import MainToolbar from '../MainToolbar';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import t from '../common/localization';
import { useEffectAsync } from '../reactHelper';
import EditCollectionView from '../EditCollectionView';

const useStyles = makeStyles(theme => ({
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
}));

const ComputedAttributeView = ({ updateTimestamp, onMenuClick }) => {
  const classes = useStyles();

  const [items, setItems] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/attributes/computed');
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
          <TableCell>{t('sharedDescription')}</TableCell>
          <TableCell>{t('sharedAttribute')}</TableCell>
          <TableCell>{t('sharedExpression')}</TableCell>
          <TableCell>{t('sharedType')}</TableCell>
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
}

const ComputedAttributesPage = () => {
  return (
    <>
      <MainToolbar />
      <EditCollectionView content={ComputedAttributeView} editPath="/settings/attribute/computed" endpoint="attributes/computed" />
    </>
  );
}

export default ComputedAttributesPage;
