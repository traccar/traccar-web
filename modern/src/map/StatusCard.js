import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  makeStyles, Button, Card, CardContent, Typography, CardActions, CardHeader, IconButton, Avatar, Table, TableBody, TableRow, TableCell, TableContainer,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';
import PublishIcon from '@material-ui/icons/Publish';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useTranslation } from '../LocalizationProvider';
import {
  formatCourse, formatDistance, formatSpeed, formatStatus,
} from '../common/formatter';
import RemoveDialog from '../RemoveDialog';
import { useAttributePreference } from '../common/preferences';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '300px',
  },
  negative: {
    color: theme.palette.colors.negative,
  },
  listItemContainer: {
    maxWidth: '240px',
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
}));

const StatusRow = ({ name, value }) => {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell className={classes.cell}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">{value}</Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, onClose }) => {
  const classes = useStyles();
  const history = useHistory();
  const t = useTranslation();

  const device = useSelector((state) => state.devices.items[deviceId]);
  const position = useSelector((state) => state.positions.items[deviceId]);

  const distanceUnit = useAttributePreference('distanceUnit');
  const speedUnit = useAttributePreference('speedUnit');

  const [removeDialogShown, setRemoveDialogShown] = useState(false);

  return (
    <>
      {device && (
        <Card elevation={3}>
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
                    <StatusRow name={t('positionSpeed')} value={formatSpeed(position.speed, speedUnit, t)} />
                    <StatusRow name={t('positionBattery')} value={formatSpeed(position.speed, speedUnit, t)} />
                    {position.attributes.odometer
                      ? <StatusRow name={t('positionOdometer')} value={formatDistance(position.attributes.odometer, distanceUnit, t)} />
                      : <StatusRow name={t('deviceTotalDistance')} value={formatDistance(position.attributes.totalDistance, distanceUnit, t)} />}
                    <StatusRow name={t('positionCourse')} value={formatCourse(position.course)} />
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          )}
          <CardActions disableSpacing>
            <Button onClick={() => history.push(`/position/${position.id}`)} disabled={!position} color="secondary">
              {t('sharedInfoTitle')}
            </Button>
            <IconButton onClick={() => history.push('/replay')} disabled={!position}>
              <ReplayIcon />
            </IconButton>
            <IconButton>
              <PublishIcon />
            </IconButton>
            <IconButton onClick={() => history.push(`/device/${deviceId}`)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setRemoveDialogShown(true)} className={classes.negative}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
      <RemoveDialog
        open={removeDialogShown}
        endpoint="devices"
        itemId={deviceId}
        onResult={() => setRemoveDialogShown(false)}
      />
    </>
  );
};

export default StatusCard;
