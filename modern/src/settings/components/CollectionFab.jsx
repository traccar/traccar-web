import React from 'react';
import { Fab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useRestriction } from '../../common/util/permissions';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      bottom: `calc(${theme.dimensions.bottomBarHeight}px + ${theme.spacing(2)})`,
    },
  },
}));

const CollectionFab = ({ editPath, disabled }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const readonly = useRestriction('readonly');

  if (!readonly && !disabled) {
    return (
      <Fab size="medium" color="primary" className={classes.fab} onClick={() => navigate(editPath)}>
        <AddIcon />
      </Fab>
    );
  }
  return '';
};

export default CollectionFab;
