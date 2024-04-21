import { useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

<<<<<<< HEAD:src/common/theme/index.js
export default (server, darkMode, direction) => useMemo(() => createTheme({
  palette: palette(server, darkMode),
  direction,
  dimensions,
  components,
}), [server, darkMode, direction]);
=======
export default (server, darkMode) => useMemo(() => createTheme({
  palette: palette(server, darkMode),
  dimensions,
  components,
}), [server, darkMode]);
>>>>>>> master:modern/src/common/theme/index.js
