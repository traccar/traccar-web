import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
  Badge,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { useTheme } from "@mui/material/styles";
import { sessionActions } from "../../store";
import { useTranslation } from "./LocalizationProvider";
import { useRestriction } from "../util/permissions";
import { nativePostMessage } from "./NativeInterface";

import tfnnLogo from "/public/32-32-logo.ico";
const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const readonly = useRestriction("readonly");
  const disableReports = useRestriction("disableReports");
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);

  const [anchorEl, setAnchorEl] = useState(null);

  const currentSelection = () => {
    if (location.pathname === `/settings/user/${user.id}`) {
      return "account";
    }
    if (location.pathname.startsWith("/settings")) {
      return "settings";
    }
    if (location.pathname.startsWith("/reports")) {
      return "reports";
    }
    if (location.pathname === "/") {
      return "Home";
    }
    return null;
  };

  const handleAccount = () => {
    setAnchorEl(null);
    navigate(`/settings/user/${user.id}`);
  };

  const handleLogout = async () => {
    setAnchorEl(null);

    const notificationToken = window.localStorage.getItem("notificationToken");
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem("notificationToken");
      const tokens = user.attributes.notificationTokens?.split(",") || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(",")
                : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch("/api/session", { method: "DELETE" });
    nativePostMessage("logout");
    navigate("/login");
    dispatch(sessionActions.updateUser(null));
  };

  const handleSelection = (event, value) => {
    switch (value) {
      case "Home":
        navigate("/");
        break;
      case "reports":
        if (selectedDeviceId != null) {
          navigate(`/reports/combined?deviceId=${selectedDeviceId}`);
        } else {
          navigate("/reports/combined");
        }
        break;
      case "settings":
        navigate("/settings/preferences");
        break;
      case "account":
        setAnchorEl(event.currentTarget);
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {desktop ? (
        <>
          <BottomNavigation
            style={{ background: "unset" }}
            value={currentSelection()}
            onChange={handleSelection}
            showLabels>
            <BottomNavigationAction
              label={t("homeTitle")}
              icon={
                <Badge invisible={socket !== false}>
                  <HomeIcon fontSize="large" />
                </Badge>
              }
              value="Home"
              sx={{
                "& .MuiBottomNavigationAction-label": { fontSize: "1.2rem" },
                width: "max-content",
              }}
            />
            {!disableReports && (
              <BottomNavigationAction
                label={t("reportTitle")}
                icon={<DescriptionIcon fontSize="large" />}
                value="reports"
                sx={{
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "large",
                    width: "max-content",
                  },
                }}
              />
            )}
            <BottomNavigationAction
              label={t("settingsTitle")}
              icon={<SettingsIcon fontSize="large" />}
              value="settings"
              sx={{
                "& .MuiBottomNavigationAction-label": { fontSize: "large" },
                width: "max-content",
              }}
            />

            {readonly ? (
              <BottomNavigationAction
                label={t("loginLogout")}
                icon={<ExitToAppIcon fontSize="large" />}
                value="logout"
                sx={{
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "large",
                    width: "max-content",
                  },
                }}
              />
            ) : (
              <BottomNavigationAction
                label={t("settingsUser")}
                icon={<PersonIcon fontSize="large" />}
                value="account"
                sx={{
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "large",
                    width: "max-content",
                  },
                }}
              />
            )}
            <BottomNavigationAction
              label={t("TFNN")}
              icon={
                <Badge
                  color="error"
                  variant="dot"
                  overlap="circular"
                  invisible={socket !== false}>
                  <img src={tfnnLogo} alt="tfnnikan logo" />
                </Badge>
              }
              sx={{
                "& .MuiBottomNavigationAction-label": { fontSize: "1.2rem" },
                "& .MuiBadge-root": { margin: ".2rem" },
                width: "max-content",
              }}
              component={ButtonBase}
              onClick={() => window.open("https://www.tfnn.ir", "_blank")}
            />
          </BottomNavigation>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleAccount}>
              <Typography color="textPrimary">{t("settingsUser")}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography color="error">{t("loginLogout")}</Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <Paper square elevation={3}>
          <BottomNavigation
            value={currentSelection()}
            onChange={handleSelection}
            showLabels>
            <BottomNavigationAction
              label={t("homeTitle")}
              icon={
                <Badge
                  color="error"
                  variant="dot"
                  overlap="circular"
                  invisible={socket !== false}>
                  <HomeIcon />
                </Badge>
              }
              value="Home"
            />
            {!disableReports && (
              <BottomNavigationAction
                label={t("reportTitle")}
                icon={<DescriptionIcon />}
                value="reports"
              />
            )}
            <BottomNavigationAction
              label={t("settingsTitle")}
              icon={<SettingsIcon />}
              value="settings"
            />
            {readonly ? (
              <BottomNavigationAction
                label={t("loginLogout")}
                icon={<ExitToAppIcon />}
                value="logout"
              />
            ) : (
              <BottomNavigationAction
                label={t("settingsUser")}
                icon={<PersonIcon />}
                value="account"
              />
            )}
          </BottomNavigation>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleAccount}>
              <Typography color="textPrimary">{t("settingsUser")}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography color="error">{t("loginLogout")}</Typography>
            </MenuItem>
          </Menu>
        </Paper>
      )}
    </>
  );
};

export default BottomMenu;
