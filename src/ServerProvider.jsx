import { useState } from 'react';
import { Alert, IconButton } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectAsync } from './reactHelper';
import { sessionActions } from './store';
import Loader from './common/components/Loader';

const ServerProvider = ({ children }) => {
  const dispatch = useDispatch();

  const initialized = useSelector((state) => !!state.session.server);
  const [error, setError] = useState(null);

  useEffectAsync(async () => {
      if (!error) {
        try {
          const response = await fetch('/api/server');
          if (response.ok) {
            const server = await response.json();
            dispatch(sessionActions.updateServer(server));
            // Set the page title based on the server attribute configuration (fixes ${title} in index.html)
            try {
              const title = server.title || server.attributes?.title || server.attributes?.name;
              if (title) document.title = title;
            } catch (e) {
              // Silently ignore errors related to document title update
            }
          } else {
            const message = await response.text();
            throw Error(message || response.statusText);
          }
        } catch (error) {
          setError(error.message);
        }
      }
  }, [error]);

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <IconButton color="inherit" size="small" onClick={() => setError(null)}>
            <ReplayIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }
  if (!initialized) {
    return <Loader />;
  }
  return children;
};

export default ServerProvider;
