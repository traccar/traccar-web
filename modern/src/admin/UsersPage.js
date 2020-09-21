import React, { useState } from 'react';
import MainToobar from '../MainToolbar';
import { useHistory } from 'react-router-dom';
import { TableContainer, Table, TableRow, TableCell, TableHead, TableBody, makeStyles } from '@material-ui/core';
import t from '../common/localization';
import formatter from '../common/formatter';
import { useEffectAsync } from '../reactHelper';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  form: {
    padding: theme.spacing(1, 2, 2),
  },
}));

const UsersPage = () => {
  const history = useHistory();
  const classes = useStyles();
  const [data, setData] = useState([]);

  useEffectAsync(async () => {
    const response = await fetch('/api/users');
    if (response.ok) {
      setData(await response.json());
    }
  }, []);

  return (
    <div className={classes.root}>
      <MainToobar history={history} />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('sharedName')}</TableCell>
              <TableCell>{t('userEmail')}</TableCell>
              <TableCell>{t('userAdmin')}</TableCell>
              <TableCell>{t('sharedDisabled')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatter(item, 'name')}</TableCell>
                <TableCell>{formatter(item, 'email')}</TableCell>
                <TableCell>{formatter(item, 'administrator')}</TableCell>
                <TableCell>{formatter(item, 'disabled')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default UsersPage;
