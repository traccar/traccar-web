import React, { useState } from 'react';
import MainToolbar from './MainToolbar';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles, Checkbox, Fab } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import t from './common/localization';
import { useEffectAsync } from './reactHelper';
import EditCollectionView from './EditCollectionView';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(theme => ({
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


const DriversView = ({ updateTimestamp }) => {
  const classes = useStyles();
  const { deviceId } = useParams();

  const [items, setItems] = useState([]);
  const [linked, setLinked] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/drivers');
    if (response.ok) {
      setItems(await response.json());
    }
  }, [updateTimestamp]);

  useEffectAsync(async () => {
    const query = new URLSearchParams({ deviceId });
    const response = await fetch(`/api/drivers?${query.toString()}`);
    if (response.ok) {
      const data = await response.json();
      setLinked(data.map(it => it.id));
    }
  }, [updateTimestamp]);

  const handleChange = async (event, driverId) => {
    const checked = event.target.checked
    if (checked) {
      setLinked([ ...linked, driverId ]);
    } else {
      const newValue = linked.filter(it => it !== driverId);
      setLinked(newValue);
    }

    await fetch('/api/permissions', {
      method: checked ? 'POST' : 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, driverId }),
    });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.columnAction} />
            <TableCell>{t('sharedName')}</TableCell>
            <TableCell>{t('deviceIdentifier')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className={classes.columnAction} padding="none">
                <Checkbox checked={linked.includes(item.id)} onChange={e => handleChange(e, item.id)} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.uniqueId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const DeviceDriverPage = () => {
  const classes = useStyles();
  const history = useHistory();
  
  return (
    <>
      <MainToolbar />
      <Fab size="medium" color="primary" className={classes.fab} onClick={() => history.goBack()}>
        <CancelIcon />
      </Fab>       
      <EditCollectionView content={DriversView} />
    </>
  )
}

export default DeviceDriverPage;
