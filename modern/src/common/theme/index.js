import { createTheme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';
import components from './components';

const theme = createTheme({
  palette,
  dimensions,
  components,
});

export default theme;
