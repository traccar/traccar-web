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
].filter((value, index, self) => self.indexOf(value) === index);

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
  buttons: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-evenly',
    '& > *': {
      flexBasis: '33%',
    },
  },
}));

const ChangeServerPage = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const t = useTranslation();

  const filter = createFilterOptions();
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [inputValue, setInputValue] = useState(currentServer);

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

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
        renderInput={(params) => <TextField {...params} label={t('settingsServer')} error={invalid} />}
        value={currentServer}
        onChange={(_, value) => value && validateUrl(value) ? handleSubmit(value) : setInvalid(true)}
        inputValue={inputValue}
        onInputChange={(_, value) => {
          setInputValue(value);
          setInvalid(false);
        }}
        filterOptions={filter}
      />
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          {t('sharedCancel')}
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => inputValue && validateUrl(inputValue) ? handleSubmit(inputValue) : setInvalid(true)}
          disabled={!inputValue || invalid}
        >
          {t('sharedSave')}
        </Button>
      </div>

    </Container>
  );
};

export default ChangeServerPage;
