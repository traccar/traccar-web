import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Draggable from 'react-draggable';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  MenuItem,
  CardMedia,
  Link,
  Tooltip,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import PublishIcon from '@mui/icons-material/Publish';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorIcon from '@mui/icons-material/Error';

import { useTranslation } from './LocalizationProvider';
import RemoveDialog from './RemoveDialog';
import PositionValue from './PositionValue';
import { useDeviceReadonly } from '../util/permissions';
import usePositionAttributes from '../attributes/usePositionAttributes';
import { devicesActions } from '../../store';
import { useCatch, useCatchCallback } from '../../reactHelper';
import { useAttributePreference } from '../util/preferences';
import {
  formatAlarm,
} from '../util/formatter';

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: 'difference',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 1, 1),
  },
  content: {
    padding: theme.spacing(20, 2, 0, 1),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
  },
  delete: {
    color: theme.palette.error.main,
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  cell: {
    borderBottom: 'none',
  },
  actions: {
    justifyContent: 'space-between',
  },
  root: ({ desktopPadding }) => ({
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    [theme.breakpoints.up('md')]: {
      left: `calc(50% + ${desktopPadding} / 2)`,
      bottom: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      left: '50%',
      bottom: 0,
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    transform: 'translateX(-50%)',
  }),

  error: {
    color: theme.palette.error.main,
  },
}));

const VisualCell = ({ name, content }) => {
  const cellStyle = {
    minWidth: 90,
    maxWidth: 90,
    margin: 0,
    padding: 1,
    borderBottom: 'none',
  };
  return (
    <TableCell style={cellStyle}>
      <Card sx={{ minHeight: 43, maxHeight: 43 }}>
        <Typography sx={{ fontSize: 14 }} align="center" variant="h6">{content == null ? '-' : content}</Typography>
        <Typography sx={{ fontSize: 12 }} align="center" variant="subtitle1">{name}</Typography>
      </Card>
    </TableCell>
  );
};
const StatusRow = ({ name, content }) => {
  const classes = useStyles();
  const cellStyle = {
    minWidth: 90,
    maxWidth: 90,
    paddingLeft: 8,
  };
  return (
    <TableRow>
      <TableCell className={classes.cell} style={cellStyle}>
        <Typography variant="body2">{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant="body2" color="textSecondary">{content}</Typography>
      </TableCell>
    </TableRow>
  );
};
const renderVisualRows = (positionItems, excludeItems, positionAttributes, position) => {
  const newPositionItems = positionItems.split(',').filter((key) => (position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key)) && !excludeItems.includes(key));

  return newPositionItems.map((key, index) => {
    if (index % 3 === 0) {
      return (
        <TableRow>
          {newPositionItems.slice(index, index + 3).map((key) => (
            <VisualCell
              key={key}
              name={positionAttributes[key]?.name || key}
              content={(
                <PositionValue
                  position={position}
                  property={position.hasOwnProperty(key) ? key : null}
                  attribute={position.hasOwnProperty(key) ? null : key}
                />
              )}
            />
          ))}
        </TableRow>
      );
    }
    return null;
  });
};
const StatusCard = ({ deviceId, position, onClose, disableActions, desktopPadding = 0 }) => {
  const classes = useStyles({ desktopPadding });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const t = useTranslation();

  const deviceReadonly = useDeviceReadonly();

  const shareDisabled = useSelector((state) => state.session.server.attributes.disableShare);
  const user = useSelector((state) => state.session.user);
  const device = useSelector((state) => state.devices.items[deviceId]);

  const deviceImage = device?.attributes?.deviceImage;

  const positionAttributes = usePositionAttributes(t);

  const positionItems = useAttributePreference('positionItems', 'fixTime,address,speed,totalDistance');

  const positionItemsTable = ['deviceTime', 'geofenceIds', 'address'];

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

  const handleGeofence = useCatchCallback(async () => {
    const newItem = {
      name: t('sharedGeofence'),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch('/api/geofences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId: position.deviceId, geofenceId: item.id }),
      });
      if (!permissionResponse.ok) {
        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  return (
    <>
      <div className={classes.root}>
        {device && (
          <Draggable
            handle={`.${classes.media}, .${classes.header}`}
          >
            <Card elevation={3} className={classes.card}>
              <div className={classes.header}>
                <Typography variant="body2" color="textSecondary">
                  {device.name}

                </Typography>
                {position.attributes.hasOwnProperty('alarm') && (
                  <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
                    <IconButton size="small">
                      <ErrorIcon fontSize="small" className={classes.error} />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  size="small"
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
              {deviceImage && (
                <CardMedia
                  className={classes.media}
                  image={`/api/media/${device.uniqueId}/${deviceImage}`}
                />
              )}
              {position && (
                <CardContent className={classes.content} sx={{ paddingTop: 0, paddingBottom: 1, paddingLeft: 1, paddingRight: 1 }}>
                  <Table>
                    <TableBody>
                      {renderVisualRows(positionItems, positionItemsTable, positionAttributes, position)}
                    </TableBody>
                  </Table>
                  <Card>
                    <Table size="small" classes={{ root: classes.table }}>
                      <TableBody>
                        {positionItemsTable.filter(
                          (key) => position.hasOwnProperty(key) || position.attributes.hasOwnProperty(key),
                        ).map((key) => (
                          <StatusRow
                            name={positionAttributes[key]?.name || key}
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
                    <Link sx={{ padding: 1, float: 'right' }} component="button" underline="none" variant="body2" onClick={() => navigate(`/position/${position.id}`)}>{t('sharedShowDetails')}</Link>
                  </Card>
                </CardContent>
              )}
              <CardActions classes={{ root: classes.actions }} disableSpacing>
                <IconButton
                  color="secondary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  disabled={!position}
                >
                  <PendingIcon />
                </IconButton>
                <IconButton
                  onClick={() => navigate('/replay')}
                  disabled={disableActions || !position}
                >
                  <ReplayIcon />
                </IconButton>
                <IconButton
                  onClick={() => navigate(`/settings/device/${deviceId}/command`)}
                  disabled={disableActions}
                >
                  <PublishIcon />
                </IconButton>
                {!deviceReadonly && (
                  <>
                    <IconButton
                      onClick={() => navigate(`/settings/device/${deviceId}`)}
                      disabled={disableActions || deviceReadonly}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => setRemoving(true)}
                      disabled={disableActions || deviceReadonly}
                      className={classes.delete}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </CardActions>
            </Card>
          </Draggable>
        )}
      </div>
      {position && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={handleGeofence}>{t('sharedCreateGeofence')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}>{t('linkGoogleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}>{t('linkAppleMaps')}</MenuItem>
          <MenuItem component="a" target="_blank" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}>{t('linkStreetView')}</MenuItem>
          {!shareDisabled && !user.temporary && <MenuItem onClick={() => navigate(`/settings/device/${deviceId}/share`)}>{t('deviceShare')}</MenuItem>}
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
