import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import RemoveDialog from '../../common/components/RemoveDialog';
import { useTranslation } from '../../common/components/LocalizationProvider';

const CollectionActions = ({
  itemId, editPath, endpoint, setTimestamp,
}) => {
  const history = useHistory();
  const t = useTranslation();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);

  const handleEdit = () => {
    history.push(`${editPath}/${itemId}`);
    setMenuAnchorEl(null);
  };

  const handleRemove = () => {
    setRemoving(true);
    setMenuAnchorEl(null);
  };

  const handleRemoveResult = (removed) => {
    setRemoving(false);
    if (removed && setTimestamp) {
      setTimestamp(Date.now());
    }
  };

  return (
    <>
      <IconButton size="small" onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={!!menuAnchorEl} anchorEl={menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
        <MenuItem onClick={handleEdit}>{t('sharedEdit')}</MenuItem>
        <MenuItem onClick={handleRemove}>{t('sharedRemove')}</MenuItem>
      </Menu>
      <RemoveDialog style={{ transform: 'none' }} open={removing} endpoint={endpoint} itemId={itemId} onResult={handleRemoveResult} />
    </>
  );
};

export default CollectionActions;
