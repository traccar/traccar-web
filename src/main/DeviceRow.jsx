import React, { useState, useEffect } from "react";
import {
  Typography,
  ListItemButton,
  ListItemText,
  IconButton,
  CardActions,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAttributePreference } from "../common/util/preferences";
import { useAdministrator } from "../common/util/permissions";
import { useDispatch, useSelector } from "react-redux";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { devicesActions } from "../store";
import { useTranslation } from "../common/components/LocalizationProvider";
import PendingIcon from "@mui/icons-material/Pending";
import ReplayIcon from "@mui/icons-material/Replay";
import PublishIcon from "@mui/icons-material/Publish";
import { useDeviceReadonly } from "../common/util/permissions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCatch, useCatchCallback } from "../../src/reactHelper";
import RemoveDialog from "../common/components/RemoveDialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const DeviceRow = ({ data, index, style, disableActions }) => {
  const dispatch = useDispatch();
  const devicePrimary = useAttributePreference("devicePrimary", "name");
  const admin = useAdministrator();
  const item = data[index];
  const position = useSelector((state) => state.session.positions[item.id]);
  const drivers = useSelector((state) => state.drivers.items);
  const shareDisabled = useSelector(
    (state) => state.session.server.attributes.disableShare
  );
  const user = useSelector((state) => state.session.user);
  const t = useTranslation();
  const deviceReadonly = useDeviceReadonly();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [address, setAddress] = useState("Fetching address...");
  const navigationAppLink = useAttributePreference("navigationAppLink");
  const navigationAppTitle = useAttributePreference("navigationAppTitle");

  const handleRemove = useCatch(async (removed) => {
    if (removed) {
      const response = await fetch("/api/devices");
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
      name: t("sharedGeofence"),
      area: `CIRCLE (${position.latitude} ${position.longitude}, 50)`,
    };
    const response = await fetch("/api/geofences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });
    if (response.ok) {
      const item = await response.json();
      const permissionResponse = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: position.deviceId,
          geofenceId: item.id,
        }),
      });
      if (!permissionResponse.ok) {
        throw Error(await permissionResponse.text());
      }
      navigate(`/settings/geofence/${item.id}`);
    } else {
      throw Error(await response.text());
    }
  }, [navigate, position]);

  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();

      return data.display_name || "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  // Find the assigned driver based on uniqueId
  const assignedDriver = Object.values(drivers).find(
    (driver) => driver.uniqueId === item.uniqueId
  );
  const driverName = assignedDriver ? assignedDriver.name : "Not Assigned";

  useEffect(() => {
    if (position?.latitude && position?.longitude) {
      getAddressFromCoords(position.latitude, position.longitude).then(
        setAddress
      );
    }
  }, [position]);

  const lastUpdate = item.lastUpdate
    ? dayjs(item.lastUpdate).fromNow()
    : "Offline";

  // Determine vehicle status and color
  let vehicleStatus = "Unknown";
  let statusColor = "text.secondary"; // Default color
  if (position?.attributes) {
    const { ignition, speed } = position.attributes;
    if (ignition === false && speed === 0) {
      vehicleStatus = "Parked";
      statusColor = "error.main"; // Red
    } else if (ignition === true && speed === 0) {
      vehicleStatus = "Idle";
      statusColor = "warning.main"; // Yellow
    } else if (ignition === true && speed > 0) {
      vehicleStatus = "Moving";
      statusColor = "success.main"; // Green
    }
  }
  return (
    <ListItemButton
      key={item.id}
      onClick={() => dispatch(devicesActions.selectId(item.id))}
      disabled={!admin && item.disabled}
    >
      <ListItemText
        primary={item[devicePrimary]}
        primaryTypographyProps={{ noWrap: true }}
        secondary={
          <>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ my: "10px" }}
            >
              Driver: {driverName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                my: "10px",
                display: "flex",
                alignItems: "center",
                color: statusColor,
              }}
            >
              <AccessTimeOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />{" "}
              {lastUpdate} | {vehicleStatus}
            </Typography>
            <Typography
              variant="body2"
              sx={{ my: "10px", display: "flex", alignItems: "center" }}
            >
              <LocationOnIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "grey" }}
              />
              {address || "Address not available"}
            </Typography>
            <CardActions>
              <Tooltip title={t("sharedExtra")}>
                <IconButton
                  color="secondary"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  disabled={!position}
                >
                  <PendingIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("reportReplay")}>
                <IconButton
                  onClick={() => navigate("/replay")}
                  disabled={disableActions || !position}
                >
                  <ReplayIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("commandTitle")}>
                <IconButton
                  onClick={() =>
                    navigate(`/settings/device/${item.id}/command`)
                  }
                  disabled={disableActions}
                >
                  <PublishIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedEdit")}>
                <IconButton
                  onClick={() => navigate(`/settings/device/${item.id}`)}
                  disabled={disableActions || deviceReadonly}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("sharedRemove")}>
                <IconButton
                  color="error"
                  onClick={() => setRemoving(true)}
                  disabled={disableActions || deviceReadonly}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
            {position && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleGeofence}>
                  {t("sharedCreateGeofence")}
                </MenuItem>
                <MenuItem
                  component="a"
                  target="_blank"
                  href={`https://www.google.com/maps/search/?api=1&query=${position.latitude}%2C${position.longitude}`}
                >
                  {t("linkGoogleMaps")}
                </MenuItem>
                <MenuItem
                  component="a"
                  target="_blank"
                  href={`http://maps.apple.com/?ll=${position.latitude},${position.longitude}`}
                >
                  {t("linkAppleMaps")}
                </MenuItem>
                <MenuItem
                  component="a"
                  target="_blank"
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${position.latitude}%2C${position.longitude}&heading=${position.course}`}
                >
                  {t("linkStreetView")}
                </MenuItem>
                {navigationAppTitle && (
                  <MenuItem
                    component="a"
                    target="_blank"
                    href={navigationAppLink
                      .replace("{latitude}", position.latitude)
                      .replace("{longitude}", position.longitude)}
                  >
                    {navigationAppTitle}
                  </MenuItem>
                )}
                {!shareDisabled && !user.temporary && (
                  <MenuItem
                    onClick={() =>
                      navigate(`/settings/device/${item.id}/share`)
                    }
                  >
                    <Typography color="secondary">
                      {t("deviceShare")}
                    </Typography>
                  </MenuItem>
                )}
              </Menu>
            )}
            <RemoveDialog
              open={removing}
              endpoint="devices"
              itemId={item.id}
              onResult={(removed) => handleRemove(removed)}
            />
          </>
        }
      />
    </ListItemButton>
  );
};

export default DeviceRow;

// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import makeStyles from '@mui/styles/makeStyles';
// import {
//   IconButton, Tooltip, Avatar, ListItemAvatar, ListItemText, ListItemButton,Typography
// } from '@mui/material';
// import BatteryFullIcon from '@mui/icons-material/BatteryFull';
// import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
// import Battery60Icon from '@mui/icons-material/Battery60';
// import BatteryCharging60Icon from '@mui/icons-material/BatteryCharging60';
// import Battery20Icon from '@mui/icons-material/Battery20';
// import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
// import ErrorIcon from '@mui/icons-material/Error';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
// import { devicesActions } from '../store';
// import {
//   formatAlarm, formatBoolean, formatPercentage, formatStatus, getStatusColor,
// } from '../common/util/formatter';
// import { useTranslation } from '../common/components/LocalizationProvider';
// import { mapIconKey, mapIcons } from '../map/core/preloadImages';
// import { useAdministrator } from '../common/util/permissions';
// import EngineIcon from '../resources/images/data/engine.svg?react';
// import { useAttributePreference } from '../common/util/preferences';

// dayjs.extend(relativeTime);

// const useStyles = makeStyles((theme) => ({
//   icon: {
//     width: '25px',
//     height: '25px',
//     filter: 'brightness(0) invert(1)',
//   },
//   batteryText: {
//     fontSize: '0.75rem',
//     fontWeight: 'normal',
//     lineHeight: '0.875rem',
//   },
//   success: {
//     color: theme.palette.success.main,
//   },
//   warning: {
//     color: theme.palette.warning.main,
//   },
//   error: {
//     color: theme.palette.error.main,
//   },
//   neutral: {
//     color: theme.palette.neutral.main,
//   },
// }));

// const DeviceRow = ({ data, index, style }) => {
//   const classes = useStyles();
//   const dispatch = useDispatch();
//   const t = useTranslation();

//   const admin = useAdministrator();

//   const item = data[index];
//   const position = useSelector((state) => state.session.positions[item.id]);

//   const devicePrimary = useAttributePreference('devicePrimary', 'name');
//   const deviceSecondary = useAttributePreference('deviceSecondary', '');

//   const secondaryText = () => {
//     let status;
//     if (item.status === 'online' || !item.lastUpdate) {
//       status = formatStatus(item.status, t);
//     } else {
//       status = dayjs(item.lastUpdate).fromNow();
//     }
//     return (
//       <>
//         {deviceSecondary && item[deviceSecondary] && `${item[deviceSecondary]} • `}
//         <span className={classes[getStatusColor(item.status)]}>{status}</span>
//       </>
//     );
//   };

//   return (
//     <div style={style}>
//       <ListItemButton
//         key={item.id}
//         onClick={() => dispatch(devicesActions.selectId(item.id))}
//         disabled={!admin && item.disabled}
//       >
//         {/* <ListItemAvatar>
//           <Avatar>
//             <img className={classes.icon} src={mapIcons[mapIconKey(item.category)]} alt="" />
//           </Avatar>
//         </ListItemAvatar> */}
//         <ListItemText
//           primary={item[devicePrimary]}
//           primaryTypographyProps={{ noWrap: true }}
//           // secondary={secondaryText()}
//           // secondaryTypographyProps={{ noWrap: true }}
//         />
//         <Typography variant="body2" color="text.secondary">Driver: Not Assigned</Typography>
//         {/* {position && (
//           <>
//             {position.attributes.hasOwnProperty('alarm') && (
//               <Tooltip title={`${t('eventAlarm')}: ${formatAlarm(position.attributes.alarm, t)}`}>
//                 <IconButton size="small">
//                   <ErrorIcon fontSize="small" className={classes.error} />
//                 </IconButton>
//               </Tooltip>
//             )}
//             {position.attributes.hasOwnProperty('ignition') && (
//               <Tooltip title={`${t('positionIgnition')}: ${formatBoolean(position.attributes.ignition, t)}`}>
//                 <IconButton size="small">
//                   {position.attributes.ignition ? (
//                     <EngineIcon width={20} height={20} className={classes.success} />
//                   ) : (
//                     <EngineIcon width={20} height={20} className={classes.neutral} />
//                   )}
//                 </IconButton>
//               </Tooltip>
//             )}
//             {position.attributes.hasOwnProperty('batteryLevel') && (
//               <Tooltip title={`${t('positionBatteryLevel')}: ${formatPercentage(position.attributes.batteryLevel)}`}>
//                 <IconButton size="small">
//                   {(position.attributes.batteryLevel > 70 && (
//                     position.attributes.charge
//                       ? (<BatteryChargingFullIcon fontSize="small" className={classes.success} />)
//                       : (<BatteryFullIcon fontSize="small" className={classes.success} />)
//                   )) || (position.attributes.batteryLevel > 30 && (
//                     position.attributes.charge
//                       ? (<BatteryCharging60Icon fontSize="small" className={classes.warning} />)
//                       : (<Battery60Icon fontSize="small" className={classes.warning} />)
//                   )) || (
//                     position.attributes.charge
//                       ? (<BatteryCharging20Icon fontSize="small" className={classes.error} />)
//                       : (<Battery20Icon fontSize="small" className={classes.error} />)
//                   )}
//                 </IconButton>
//               </Tooltip>
//             )}
//           </>
//         )} */}
//       </ListItemButton>
//     </div>
//   );
// };

// export default DeviceRow;
