import React from 'react';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import { makeStyles } from '@mui/styles';
import {
  Autocomplete, Button, Container, createFilterOptions, TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../common/components/LocalizationProvider';

const currentServer = `${window.location.protocol}//${window.location.host}`;

const officialServers = [
  currentServer,
  'https://demo.traccar.org',
  'https://demo2.traccar.org',
  'https://demo3.traccar.org',
  'https://demo4.traccar.org',
  'https://server.traccar.org',
  'http://localhost:8082',
  'http://localhost:3000',
];

const useStyles = makeStyles((theme) => ({
  icon: {
    textAlign: 'center',
    fontSize: '128px',
    color: theme.palette.colors.neutral,
  },
  container: {
    textAlign: 'center',
    padding: theme.spacing(5, 3),
  },
  field: {
    margin: theme.spacing(3, 0),
  },
}));

const ChangeServerPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const filter = createFilterOptions();

  const handleSubmit = (url) => {
    if (window.webkit && window.webkit.messageHandlers.appInterface) {
      window.webkit.messageHandlers.appInterface.postMessage(`server|${url}`);
    } else if (window.appInterface) {
      window.appInterface.postMessage(`server|${url}`);
    } else {
      window.location.replace(url);
    }
  };

  return (
    <Container maxWidth="xs" className={classes.container}>
      <ElectricalServicesIcon className={classes.icon} />
      <Autocomplete
        freeSolo
        className={classes.field}
        options={officialServers}
        renderInput={(params) => <TextField {...params} label={t('settingsServer')} />}
        value={currentServer}
        onChange={(_, value) => value && handleSubmit(value)}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue && !filtered.includes(params.inputValue)) {
            filtered.push(params.inputValue);
          }
          return filtered;
        }}
      />
      <Button
        onClick={() => navigate(-1)}
        color="secondary"
      >
        {t('sharedCancel')}
      </Button>
    </Container>
  );
};

export default ChangeServerPage;
