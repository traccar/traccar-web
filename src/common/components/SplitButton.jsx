import { useRef, useState } from 'react';
import {
  Button, ButtonGroup, Menu, MenuItem, Typography,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles()(() => ({
  buttonMenu: {
    '@media print': {
      display: 'none !important',
    },
  },
}));

const SplitButton = ({
  fullWidth, variant, color, disabled, onClick, options, selected, setSelected,
}) => {
  const anchorRef = useRef();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const { classes } = useStyles();

  return (
    <>
      <ButtonGroup fullWidth={fullWidth} variant={variant} color={color} ref={anchorRef}>
        <Button disabled={disabled} onClick={() => onClick(selected)}>
          <Typography variant="button" noWrap>{options[selected]}</Typography>
        </Button>
        <Button fullWidth={false} size="small" onClick={() => setMenuAnchorEl(anchorRef.current)}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Menu
        className={classes.buttonMenu}
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
