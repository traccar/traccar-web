import React from 'react';
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

const ReportLayoutPage = ({ children, filter }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <Paper className={classes.form}>
              {filter}
            </Paper>
          </Grid>
          <Grid item xs={12} md={9} lg={10}>
            {children}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default ReportLayoutPage;
