import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { useSelector } from 'react-redux';

import t from './common/localization';
import RemoveDialog from './RemoveDialog';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const EditCollectionView = ({ content, editPath, endpoint }) => {
  const classes = useStyles();
  const history = useHistory();

  const [selectedId, setSelectedId] = useState(null);
  const [selectedAnchorEl, setSelectedAnchorEl] = useState(null);
  const [removeDialogShown, setRemoveDialogShown] = useState(false);
  const [updateTimestamp, setUpdateTimestamp] = useState(Date.now());
  const adminEnabled = useSelector(state => state.session.user && state.session.user.administrator);

  const menuShow = (anchorId, itemId) => {
    setSelectedAnchorEl(anchorId);
    setSelectedId(itemId);
  }

  const menuHide = () => {
    setSelectedAnchorEl(null);
  }

  const handleAdd = () => {
    history.push(editPath);
    menuHide();
  }

  const handleEdit = () => {
    history.push(`${editPath}/${selectedId}`);
    menuHide();
  }

  const handleRemove = () => {
    setRemoveDialogShown(true);
    menuHide();
  }

  const handleRemoveResult = () => {
    setRemoveDialogShown(false);
    setUpdateTimestamp(Date.now());
  }

  const Content = content;

  return (
    <>
      <Content updateTimestamp={updateTimestamp} onMenuClick={menuShow} />
      {adminEnabled && 
        <Fab size="medium" color="primary" className={classes.fab} onClick={handleAdd}>
          <AddIcon />
        </Fab>
      }
      <Menu open={!!selectedAnchorEl} anchorEl={selectedAnchorEl} onClose={menuHide}>
        <MenuItem onClick={handleEdit}>{t('sharedEdit')}</MenuItem>
        <MenuItem onClick={handleRemove}>{t('sharedRemove')}</MenuItem>
      </Menu>
      <RemoveDialog open={removeDialogShown} endpoint={endpoint} itemId={selectedId} onResult={handleRemoveResult} />
    </>
  );
}

export default EditCollectionView;
