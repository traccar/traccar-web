import { createTheme } from '@material-ui/core/styles';
import palette from './palette';
import overrides from './overrides';
import dimensions from './dimensions';
import typography from './typography';

const theme = createTheme({
  palette,
  overrides,
  dimensions,
  typography,
});

export default theme;
