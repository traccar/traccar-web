import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';

import t from './common/localization';
import EditItemView from './EditItemView';

const DevicePage = () => {
  const [item, setItem] = useState();

  const [name, setName] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  const getItem = () => {
    const updatedItem = item;
    updatedItem.name = name || item.name;
    updatedItem.uniqueId = uniqueId || item.uniqueId;
    return updatedItem;
  };

  return (
    <EditItemView endpoint="devices" setItem={setItem} getItem={getItem}>
      {item &&
        <>
          <TextField
            margin="normal"
            fullWidth
            defaultValue={item.name}
            onChange={(event) => setName(event.target.value)}
            label={t('sharedName')}
            variant="filled" />
          <TextField
            margin="normal"
            fullWidth
            defaultValue={item.uniqueId}
            onChange={(event) => setUniqueId(event.target.value)}
            label={t('deviceIdentifier')}
            variant="filled" />
        </>
      }
    </EditItemView>
  );
}

export default DevicePage;
