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

import { useTranslation } from '../../LocalizationProvider';
import { formatStatus } from '../../common/formatter';
import RemoveDialog from '../../RemoveDialog';
import PositionValue from '../../components/PositionValue';
import dimensions from '../../theme/dimensions';
import { useDeviceReadonly, useReadonly } from '../../common/permissions';

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
  const history = useHistory();
  const t = useTranslation();

  const readonly = useReadonly();
  const deviceReadonly = useDeviceReadonly();

  const device = useSelector((state) => state.devices.items[deviceId]);
  const position = useSelector((state) => state.positions.items[deviceId]);

  const [removeDialogShown, setRemoveDialogShown] = useState(false);

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
                    <StatusRow name={t('positionSpeed')} content={<PositionValue position={position} property="speed" />} />
                    <StatusRow name={t('positionAddress')} content={<PositionValue position={position} property="address" />} />
                    {position.attributes.odometer
                      ? <StatusRow name={t('positionOdometer')} content={<PositionValue position={position} attribute="odometer" />} />
                      : <StatusRow name={t('deviceTotalDistance')} content={<PositionValue position={position} attribute="totalDistance" />} />}
                    <StatusRow name={t('positionCourse')} content={<PositionValue position={position} property="course" />} />
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
            <IconButton onClick={() => history.push(`/command/${deviceId}`)} disabled={readonly}>
              <PublishIcon />
            </IconButton>
            <IconButton onClick={() => history.push(`/device/${deviceId}`)} disabled={deviceReadonly}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setRemoveDialogShown(true)} disabled={deviceReadonly} className={classes.negative}>
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
