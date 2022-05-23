import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, Card, CardContent, Typography, CardActions, CardHeader, IconButton, Avatar, Table, TableBody, TableRow, TableCell, TableContainer,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PostAddIcon from '@material-ui/icons/PostAdd';
import ReplayIcon from '@material-ui/icons/Replay';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useTranslation } from '../common/components/LocalizationProvider';
import { formatStatus } from '../common/util/formatter';
import RemoveDialog from '../common/components/RemoveDialog';
import PositionValue from '../common/components/PositionValue';
import dimensions from '../common/theme/dimensions';
import { useDeviceReadonly, useReadonly } from '../common/util/permissions';
import usePersistedState from '../common/util/usePersistedState';
import usePositionAttributes from '../common/attributes/usePositionAttributes';
import { devicesActions } from '../store';
import { useCatch } from '../reactHelper';

const useStyles = makeStyles((theme) => ({
  card: {
    width: dimensions.popupMaxWidth,
  },
  negative: {
    color: theme.palette.colors.negative,
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  },
  cell: {
    borderBottom: 'none',
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

const StatusRow = ({ name, content }) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">{content}</Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, onClose }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useReadonly();
  const deviceReadonly = useDeviceReadonly();

  const device = useSelector((state) => state.devices.items[deviceId]);
  const position = useSelector((state) => state.positions.items[deviceId]);

  const positionAttributes = usePositionAttributes(t);
  const [positionItems] = usePersistedState('positionItems', ['speed', 'address', 'totalDistance', 'course']);

  const [removing, setRemoving] = useState(false);

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetch('/api/devices');
      if (response.ok) {
        dispatch(devicesActions.refresh(await response.json()));
      } else {
        throw Error(await response.text());
      }
    }
    setRemoving(false);
  });

  return (
    <>
      {device && (
        <Card elevation={3} className={classes.card}>
          <CardHeader
            avatar={(
              <Avatar>
                <img className={classes.icon} src={`images/icon/${device.category || 'default'}.svg`} alt="" />
              </Avatar>
            )}
            action={(
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
            title={device.name}
            subheader={formatStatus(device.status, t)}
          />
          {position && (
            <CardContent>
              <TableContainer>
                <Table size="small" classes={{ root: classes.table }}>
                  <TableBody>
                    {positionItems.map((key) => (
                      <StatusRow
                        key={key}
                        name={positionAttributes[key].name}
                        content={(
                          <PositionValue
                            position={position}
                            property={position.hasOwnProperty(key) ? key : null}
                            attribute={position.hasOwnProperty(key) ? null : key}
                          />
                        )}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          )}
          <CardActions classes={{ root: classes.actions }} disableSpacing>
            <IconButton onClick={() => navigate(`/position/${position.id}`)} disabled={!position} color="secondary">
              <PostAddIcon />
            </IconButton>
            <IconButton onClick={() => navigate('/replay')} disabled={!position}>
              <ReplayIcon />
            </IconButton>
            <IconButton onClick={() => navigate(`/settings/command-send/${deviceId}`)} disabled={readonly}>
              <PublishIcon />
            </IconButton>
            <IconButton onClick={() => navigate(`/settings/device/${deviceId}`)} disabled={deviceReadonly}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setRemoving(true)} disabled={deviceReadonly} className={classes.negative}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
      <RemoveDialog
        open={removing}
        endpoint="devices"
        itemId={deviceId}
        onResult={(removed) => handleRemove(removed)}
      />
    </>
  );
};

export default StatusCard;
