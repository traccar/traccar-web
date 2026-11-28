import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';

const MapDrawHint = ({ anchorEl, title, open }) => {
  const { direction } = useTheme();

  return (
    <Tooltip
      open={Boolean(anchorEl) && open}
      title={title}
      placement={direction === 'rtl' ? 'left' : 'right'}
      arrow
      disableInteractive
      slotProps={{ popper: { anchorEl } }}
    >
      <span />
    </Tooltip>
  );
};

export default MapDrawHint;
