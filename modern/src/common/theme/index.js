import { createTheme, adaptV4Theme } from '@mui/material/styles';
import palette from './palette';
import overrides from './overrides';
import dimensions from './dimensions';

const theme = createTheme(adaptV4Theme({
  palette,
  //overrides,
  dimensions,
}));

export default theme;
