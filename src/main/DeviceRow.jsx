import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import {
  IconButton,
  Tooltip,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Typography,
} from "@mui/material";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import Battery60Icon from "@mui/icons-material/Battery60";
import BatteryCharging60Icon from "@mui/icons-material/BatteryCharging60";
import Battery20Icon from "@mui/icons-material/Battery20";
import BatteryCharging20Icon from "@mui/icons-material/BatteryCharging20";
import ErrorIcon from "@mui/icons-material/Error";
import BurstModeIcon from "@mui/icons-material/BurstMode";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { devicesActions } from "../store";
import {
  formatAlarm,
  formatBoolean,
  formatPercentage,
  formatStatus,
  getStatusColor,
} from "../common/util/formatter";
import {
  useLocalization,
  useTranslation,
} from "../common/components/LocalizationProvider";
import { mapIconKey, mapIcons } from "../map/core/preloadImages";
import { useAdministrator } from "../common/util/permissions";
import EngineIcon from "../resources/images/data/engine.svg?react";
import { useAttributePreference } from "../common/util/preferences";
import { useTheme } from "@mui/material/styles";

dayjs.extend(relativeTime);

const useStyles = makeStyles()((theme) => ({
  icon: {
    width: "25px",
    height: "25px",
    filter: "brightness(0) invert(1)",
  },
  batteryText: {
    fontSize: "0.75rem",
    fontWeight: "normal",
    lineHeight: "0.875rem",
  },
  success: {
    color: theme.palette.success.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  neutral: {
    color: theme.palette.neutral.main,
  },
  selected: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DeviceRow = ({ devices, index, style }) => {
  const theme = useTheme();
  const { direction } = useLocalization;

  const { classes } = useStyles();
  const dispatch = useDispatch();
  const t = useTranslation();

  const admin = useAdministrator();
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const item = devices[index];
  const position = useSelector((state) => state.session.positions[item.id]);

  const devicePrimary = useAttributePreference("devicePrimary", "name");
  const deviceSecondary = useAttributePreference("deviceSecondary", "");

  const secondaryText = () => {
    let status;
    if (item.status === "online" || !item.lastUpdate) {
      status = formatStatus(item.status, t);
    } else {
      status = dayjs(item.lastUpdate).fromNow();
    }
    return (
      <>
        {deviceSecondary &&
          item[deviceSecondary] &&
          `${item[deviceSecondary]} • `}
        <span className={classes[getStatusColor(item.status)]}>{status}</span>
      </>
    );
  };

  return (
    <div style={{ ...style, borderBottom: "1px solid rgba(0, 0, 0,.1)" }}>
      <ListItemButton
        key={item.id}
        onClick={() => dispatch(devicesActions.selectId(item.id))}
        disabled={!admin && item.disabled}
        selected={selectedDeviceId === item.id}
        className={selectedDeviceId === item.id ? classes.selected : null}>
        <ListItemAvatar>
          <Avatar
            sx={{
              bgcolor: theme.palette.neutral?.main || "#ccc",
              width: 40,
              height: 40,
            }}>
            <img
              style={{
                width: "25px",
                height: "25px",
                filter: "brightness(0) invert(1)",
              }}
              src={mapIcons[mapIconKey(item.category)]}
              alt=""
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item[devicePrimary]}
          secondary={secondaryText()}
          slots={{
            primary: Typography,
            secondary: Typography,
          }}
          slotProps={{
            primary: { noWrap: true },
            secondary: { noWrap: true },
          }}
        />
        {item?.model == "fmc125" && (
          <IconButton>
            <BurstModeIcon
              fontSize="large"
              sx={{ color: theme.palette.neutral?.main || "#ccc" }}
            />
          </IconButton>
        )}
        {position && (
          <>
            {position.attributes.hasOwnProperty("alarm") && (
              <Tooltip
                title={`${t("eventAlarm")}: ${formatAlarm(
                  position.attributes.alarm,
                  t
                )}`}>
                <IconButton size="small">
                  <ErrorIcon sx={{ color: theme.palette.error.main }} />
                </IconButton>
              </Tooltip>
            )}
            {position.attributes.hasOwnProperty("ignition") && (
              <Tooltip
                title={`${t("positionIgnition")}: ${formatBoolean(
                  position.attributes.ignition,
                  t
                )}`}>
                <IconButton size="small">
                  {position.attributes.ignition ? (
                    <EngineIcon
                      width={20}
                      height={20}
                      className={classes.success}
                    />
                  ) : (
                    <EngineIcon
                      width={20}
                      height={20}
                      className={classes.neutral}
                      style={{
                        color: position.attributes.ignition
                          ? theme.palette.success.main
                          : theme.palette.neutral?.main || "#ccc",
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            {position.attributes.hasOwnProperty("batteryLevel") && (
              <Tooltip
                title={`${t("positionBatteryLevel")}: ${formatPercentage(
                  position.attributes.batteryLevel
                )}`}>
                <IconButton size="small">
                  {(position.attributes.batteryLevel > 70 &&
                    (position.attributes.charge ? (
                      <BatteryChargingFullIcon
                        sx={{ color: theme.palette.success.main }}
                      />
                    ) : (
                      <BatteryFullIcon className={classes.success} />
                    ))) ||
                    (position.attributes.batteryLevel > 30 &&
                      (position.attributes.charge ? (
                        <BatteryCharging60Icon
                          sx={{ color: theme.palette.warning.main }}
                        />
                      ) : (
                        <Battery60Icon
                          sx={{ color: theme.palette.warning.main }}
                        />
                      ))) ||
                    (position.attributes.charge ? (
                      <BatteryCharging20Icon
                        fontSize="small"
                        className={classes.error}
                      />
                    ) : (
                      <Battery20Icon
                        fontSize="small"
                        className={classes.error}
                      />
                    ))}
                </IconButton>
              </Tooltip>
            )}
          </>
        )}
      </ListItemButton>
    </div>
  );
};

export default DeviceRow;
