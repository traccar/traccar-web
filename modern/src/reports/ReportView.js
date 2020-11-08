import React, { useState } from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import MainToolbar from '../MainToolbar';

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

const ReportView= ({ reportFilterForm:ReportFilterForm, reportListView:ReportListView }) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  
  const onResult = (data) => {
    setData(data);
  }
  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <Paper className={classes.form}>
              <ReportFilterForm onResult={ onResult } />
            </Paper>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            <ReportListView items={ data } />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ReportView;
