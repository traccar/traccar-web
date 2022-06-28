import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  CardHeader,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

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
import { mapIcons } from '../map/core/preloadImages';

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

  const [anchorEl, setAnchorEl] = useState(null);

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
                <img className={classes.icon} src={mapIcons[device.category || 'default']} alt="" />
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
              <Table size="small" classes={{ root: classes.table }}>
                <TableBody>
                  {positionItems.filter((key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)).map((key) => (
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
            </CardContent>
          )}
          <CardActions classes={{ root: classes.actions }} disableSpacing>
            <IconButton
              color="secondary"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              disabled={!position}
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              onClick={() => navigate('/replay')}
              disabled={!position}
            >
              <ReplayIcon />
            </IconButton>
            <IconButton
              onClick={() => navigate(`/settings/command-send/${deviceId}`)}
              disabled={readonly}
            >
              <PublishIcon />
            </IconButton>
            <IconButton
              onClick={() => navigate(`/settings/device/${deviceId}`)}
              disabled={deviceReadonly}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => setRemoving(true)}
              disabled={deviceReadonly}
              className={classes.negative}
            >
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      )}
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => navigate(`/position/${position.id}`)}><Typography color="secondary">{t('sharedShowDetails')}</Typography></MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}`}>{t('linkStreetView')}</MenuItem>
        </Menu>
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
