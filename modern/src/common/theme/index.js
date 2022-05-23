import { createTheme, adaptV4Theme } from '@mui/material/styles';
import palette from './palette';
import dimensions from './dimensions';

const theme = createTheme(adaptV4Theme({
  palette,
  dimensions,
}));

export default theme;
