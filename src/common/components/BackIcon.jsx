import { useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BackIcon = () => {
  const theme = useTheme();
  return theme.direction === 'rtl' ? <ArrowForwardIcon /> : <ArrowBackIcon />;
};

export default BackIcon;
