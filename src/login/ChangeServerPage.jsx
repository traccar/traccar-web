import { useState } from 'react';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import { makeStyles } from 'tss-react/mui';
import {
  Autocomplete, Button, Container, createFilterOptions, TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../common/components/LocalizationProvider';
import Loader from '../common/components/Loader';

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

const useStyles = makeStyles()((theme) => ({
  icon: {
    textAlign: 'center',
    fontSize: '10rem',
    color: theme.palette.neutral.main,
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const filter = createFilterOptions();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (url) => {
    setLoading(true);
    if (window.webkit && window.webkit.messageHandlers.appInterface) {
      window.webkit.messageHandlers.appInterface.postMessage(`server|${url}`);
    } else if (window.appInterface) {
      window.appInterface.postMessage(`server|${url}`);
    } else {
      window.location.replace(url);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <Container maxWidth="xs" className={classes.container}>
      <VpnLockIcon className={classes.icon} />
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
