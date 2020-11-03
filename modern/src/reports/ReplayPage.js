import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Container, FormControl, makeStyles, Paper, Slider, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MainToolbar from '../MainToolbar';
import Map from '../map/Map';
import t from '../common/localization';
import FilterForm from './FilterForm';
import ReplayPathMap from '../map/ReplayPathMap';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  controlPanel: {
    position: 'absolute',
    bottom: theme.spacing(5),
    left: '50%',
    transform: 'translateX(-50%)',
  },
  controlContent: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  configForm: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const ReplayPage = () => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState(true);

  const [deviceId, setDeviceId] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const [positions, setPositions] = useState([]);

  const handleShow = async () => {
    const query = new URLSearchParams({
      deviceId,
      from: from.toISOString(),
      to: to.toISOString(),
    });
    const response = await fetch(`/api/positions?${query.toString()}`, { headers: { 'Accept': 'application/json' } });
    if (response.ok) {
      setPositions(await response.json());
      setExpanded(false);
    }
  };

  return (
    <div className={classes.root}>
      <MainToolbar />
      <Map>
        <ReplayPathMap positions={positions} />
      </Map>
      <Container maxWidth="sm" className={classes.controlPanel}>
        <Paper className={classes.controlContent}>
          <Slider defaultValue={30} />
        </Paper>
        <div>
          <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography align='center'>
                {t('reportConfigure')}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.configForm}>
              <FilterForm
                deviceId={deviceId}
                setDeviceId={setDeviceId}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo} />
              <FormControl margin='normal' fullWidth>
                <Button type='button' color='primary' variant='contained' disabled={!deviceId} onClick={handleShow}>
                  {t('reportShow')}
                </Button>
              </FormControl>
            </AccordionDetails>
          </Accordion>
        </div>
      </Container>
    </div>
  );
}

export default ReplayPage;
