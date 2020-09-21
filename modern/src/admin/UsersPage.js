import React, { useState } from 'react';
import MainToobar from '../MainToolbar';
import { useHistory } from 'react-router-dom';
import { Fab, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import t from '../common/localization';
import formatter from '../common/formatter';
import { useEffectAsync } from '../reactHelper';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  columnAction: {
    width: theme.spacing(1),
    padding: theme.spacing(0, 1),
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const UsersPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [menuItemId, setMenuItemId] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  useEffectAsync(async () => {
    const response = await fetch('/api/users');
    if (response.ok) {
      setData(await response.json());
    }
  }, []);

  const handleMenuOpen = (event, itemId) => {
    setMenuItemId(itemId);
    setMenuAnchorEl(event.currentTarget);
  }

  const handleMenuClose = () => {
    setMenuItemId(null);
    setMenuAnchorEl(null);
  }

  const handleMenuEdit = () => {
    history.push(`/user/${menuItemId}`);
    handleMenuClose();
  }

  const handleMenuRemove = () => {
    //setRemoveDialogOpen(true);
    handleMenuClose();
  }

  const handleAdd = () => {
    history.push('/user');
    //handleMenuClose();
  }

  return (
    <div className={classes.root}>
      <MainToobar history={history} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.columnAction} />
              <TableCell>{t('sharedName')}</TableCell>
              <TableCell>{t('userEmail')}</TableCell>
              <TableCell>{t('userAdmin')}</TableCell>
              <TableCell>{t('sharedDisabled')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className={classes.columnAction} padding="none">
                  <IconButton onClick={(event) => handleMenuOpen(event, item.id)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{formatter(item, 'name')}</TableCell>
                <TableCell>{formatter(item, 'email')}</TableCell>
                <TableCell>{formatter(item, 'administrator')}</TableCell>
                <TableCell>{formatter(item, 'disabled')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab size="medium" color="primary" className={classes.fab} onClick={handleAdd}>
        <AddIcon />
      </Fab>
      <Menu id="context-menu" anchorEl={menuAnchorEl} keepMounted open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuEdit}>{t('sharedEdit')}</MenuItem>
        <MenuItem onClick={handleMenuRemove}>{t('sharedRemove')}</MenuItem>
      </Menu>
    </div>
  );
}

export default UsersPage;
