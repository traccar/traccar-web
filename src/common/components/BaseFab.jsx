import { Fab } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.dimensions.bottomBarHeight}px + ${theme.spacing(2)})`,
    },
  },
}));

const BaseFab = ({ children, color = 'primary', onClick }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.fab}>
      <Fab size="medium" color={color} onClick={onClick}>
        {children}
      </Fab>
    </div>
  );
};

export default BaseFab;
