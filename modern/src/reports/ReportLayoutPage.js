import React from 'react';
import { Grid, Paper, makeStyles, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import MainToolbar from '../MainToolbar';
import { chartTypes } from '../common/chartTypes';
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
  chart: {
    padding: theme.spacing(1, 2, 2),
    marginTop: theme.spacing(1),
  },
}));

const ReportLayoutPage = ({ reportFilterForm:ReportFilterForm, setItems, setType, showChartType, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MainToolbar />
      <div className={classes.content}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <Paper className={classes.form}>
              <ReportFilterForm setItems={ setItems } />
            </Paper>
            {showChartType && (
              <Paper className={classes.chart}>
                <FormControl variant="filled" margin="normal" fullWidth>
                <InputLabel>{t('reportChartType')}</InputLabel>
                <Select defaultValue="speed" onChange={e => setType(e.target.value)}>
                {chartTypes.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
                </Select>
                </FormControl>
              </Paper>
            )}
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
