import React, { useState } from 'react';
import MainToolbar from '../MainToolbar';
import { Grid, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Paper, makeStyles, IconButton, Fab, colors } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import t from '../common/localization';

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
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  edit: {
    color: 'blue'
  },
  delete: {
    color: 'red'
  }
}));

const DriverPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('sharedName')}</TableCell>
                    <TableCell>{t('deviceIdentifier')}</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Test Name</TableCell>
                    <TableCell>test1512</TableCell>
                    <TableCell>
                      <IconButton>
                        <EditIcon className={classes.edit} />
                      </IconButton>
                      <IconButton className={classes.delete}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Fab size="medium" color="primary" className={classes.fab}>
              <AddIcon />
            </Fab>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default DriverPage;