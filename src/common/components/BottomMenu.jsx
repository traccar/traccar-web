import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Menu,
  MenuItem,
  Typography,
  Badge,
} from "@mui/material";

// import DescriptionIcon from "@mui/icons-material/Description";
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
// import SettingsIcon from "@mui/icons-material/Settings";
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
// import MapIcon from "@mui/icons-material/Map";
import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
// import PersonIcon from "@mui/icons-material/Person";
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { sessionActions } from "../../store";
import { useTranslation } from "./LocalizationProvider";
import { useRestriction } from "../util/permissions";
import { nativePostMessage } from "./NativeInterface";

const BottomMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const t = useTranslation();

  const readonly = useRestriction("readonly");
  const disableReports = useRestriction("disableReports");
  const user = useSelector((state) => state.session.user);
  const socket = useSelector((state) => state.session.socket);

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
      return "map";
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
      case "map":
        navigate("/");
        break;
      case "reports":
        navigate("/reports/combined");
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
    <Paper square elevation={3}>
      <BottomNavigation
        value={currentSelection()}
        onChange={handleSelection}
        showLabels
        sx={{
          backgroundColor:"#F4F6F8"
        }}
      >
        <BottomNavigationAction
          label={t("mapTitle")}
          icon={
            <Badge
              color="error"
              variant="dot"
              overlap="circular"
              invisible={socket !== false}
              sx={{
                color: "#fff",
              }}
            >
              {/* <MapIcon /> */}
             <MapTwoToneIcon />
            </Badge>
          }
          value="map"
          sx={{
            color: "#fff",
            backgroundColor: "#9FBCFB",
            padding: "5px",
            borderRadius: "0px 10px 0px 0px",
            boxShadow: "0px 0px 5px #0707064f",
            "& .MuiBottomNavigationAction-label": {
              color: "#fff", // This changes the color of the label
            },
          }}
        />
        {!disableReports && (
          <BottomNavigationAction
            label={t("reportTitle")}
            // icon={<DescriptionIcon />}
            icon={<DescriptionTwoToneIcon />}
            value="reports"
          />
        )}
        <BottomNavigationAction
          label={t("settingsTitle")}
          // icon={<SettingsIcon />}
         icon={<SettingsApplicationsTwoToneIcon />}
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
            // icon={<PersonIcon />}
            icon={<AccountBoxTwoToneIcon />}
            value="account"
          />
        )}
      </BottomNavigation>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={handleAccount}>
          <Typography color="textPrimary">{t("settingsUser")}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Typography color="error">{t("loginLogout")}</Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default BottomMenu;