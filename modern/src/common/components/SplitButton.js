import React, { useRef, useState } from 'react';
import { Button, ButtonGroup, Menu, MenuItem, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const SplitButton = ({ fullWidth, variant, color, disabled, onClick, options }) => {
  const anchorRef = useRef();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selected, setSelected] = useState(Object.keys(options)[0]);

  return (
    <>
      <ButtonGroup fullWidth={fullWidth} variant={variant} color={color} disabled={disabled} ref={anchorRef}>
        <Button onClick={() => onClick(selected)}>
          <Typography variant="button" noWrap>{options[selected]}</Typography>
        </Button>
        <Button fullWidth={false} size="small" onClick={() => setMenuAnchorEl(anchorRef.current)}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Menu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        {Object.entries(options).map(([key, value]) => (
          <MenuItem
            key={key}
            onClick={() => {
              setSelected(key);
              setMenuAnchorEl(null);
            }}
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default SplitButton;
