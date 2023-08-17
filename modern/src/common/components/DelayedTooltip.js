import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const DelayedTooltip = ({
  ...props
}) => (
  <Tooltip
    {...props}
    enterDelay={700}
    enterNextDelay={700}
  />
);

export default DelayedTooltip;
