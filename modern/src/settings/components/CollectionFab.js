import React from 'react';
import { Fab, makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useNavigate } from 'react-router-dom';
import { useReadonly } from '../../common/util/permissions';
import dimensions from '../../common/theme/dimensions';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      bottom: dimensions.bottomBarHeight + theme.spacing(2),
    },
  },
}));

const CollectionFab = ({ editPath, disabled }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const readonly = useReadonly();

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
