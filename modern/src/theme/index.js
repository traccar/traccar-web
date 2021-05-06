import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import overrides from './overrides';
import dimensions from './dimensions';

const theme = createMuiTheme({
  palette,
  overrides,
  dimensions
});

export default theme;
