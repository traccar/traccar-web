import React from 'react';
import {
  Box,
  Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography,
} from '@mui/material';
// import SettingsIcon from '@mui/icons-material/Settings';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
// import CreateIcon from '@mui/icons-material/Create';
import ModeEditTwoToneIcon from '@mui/icons-material/ModeEditTwoTone';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleNotificationsTwoToneIcon from '@mui/icons-material/CircleNotificationsTwoTone';
// import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenTwoToneIcon from '@mui/icons-material/FolderOpenTwoTone';
// import PersonIcon from '@mui/icons-material/Person';
import AccountBoxTwoToneIcon from '@mui/icons-material/AccountBoxTwoTone';
// import StorageIcon from '@mui/icons-material/Storage';
import StorageTwoToneIcon from '@mui/icons-material/StorageTwoTone';
// import BuildIcon from '@mui/icons-material/Build';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import PeopleIcon from '@mui/icons-material/People';
// import TodayIcon from '@mui/icons-material/Today';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
// import PublishIcon from '@mui/icons-material/Publish';
import PublishTwoToneIcon from '@mui/icons-material/PublishTwoTone';
// import SmartphoneIcon from '@mui/icons-material/Smartphone';
import DevicesTwoToneIcon from '@mui/icons-material/DevicesTwoTone';
import HelpIcon from '@mui/icons-material/Help';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';

// const MenuItem = ({
//   title, link, icon, selected,
// }) => (
//   <ListItemButton key={link} component={Link} to={link} selected={selected}
//     sx={{
//     my:1,
//     borderRadius: 2,
//     mx:3,
//     bgcolor:"#fff",
//     color:"#677684",
//     '&:hover': { bgcolor: '#F6F7F9', color: 'grey' ,  },
//   }}
//   >
//     <ListItemIcon
//      sx={{ color: selected ? '#637381' : 'text.primary'  }}
//      >{icon}</ListItemIcon>
//     <ListItemText primary={<Typography variant="subtitle1" color="#637381" >{title} </Typography> } 
//     />
//   </ListItemButton>
// );
const MenuItem = ({
  title, link, icon, selected,
}) => (
  <ListItemButton disableGutters key={link} component={Link} to={link}
    sx={{
      pl: 2,
      py: 1.5,
      gap: 2,
      pr: 1.5,
      m:1.3,
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.5,
      color: '#637381',

      bgcolor: "#fff",
      '&:hover': { bgcolor: '#F6F7F9', color: '#637381', },
      ...(selected && {
        fontWeight: 'bold',
        bgcolor: '#1877F214',
        color: '#71a0de',
        '&:hover': {
          bgcolor: '#cbdff7',
        },
      }),
    }}
  >
    <Box component="span" sx={{ width: 24, height: 24 }}>
      {icon}
    </Box>

    <Box component="span" flexGrow={1}>
      {title}
    </Box>

    {/* <ListItemIcon
     sx={{ color: selected ? '#637381' : 'text.primary'  }}
     >{icon}</ListItemIcon>
    <ListItemText primary={<Typography variant="subtitle1" color="#637381" >{title} </Typography> } 
    /> */}
  </ListItemButton>
);

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useRestriction('readonly');
  const admin = useAdministrator();
  const manager = useManager();
  const userId = useSelector((state) => state.session.user.id);
  const supportLink = useSelector((state) => state.session.server.attributes.support);

  const features = useFeatures();

  return (
    <>
      <List>
        <MenuItem
          title={t('sharedPreferences')}
          link="/settings/preferences"
          // icon={<SettingsIcon />}
          icon={<SettingsApplicationsTwoToneIcon />}
          selected={location.pathname === '/settings/preferences'}
        />
        {!readonly && (
          <>
            <MenuItem
              sx={{
                pl: 2,
                py: 1,
                gap: 2,
                pr: 1.5,
                borderRadius: 0.75,
                bgcolor: 'red'
              }}
              title={t('sharedNotifications')}
              link="/settings/notifications"
              // icon={<NotificationsIcon />}
              icon={<CircleNotificationsTwoToneIcon />}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<AccountBoxTwoToneIcon />}
              selected={location.pathname === `/settings/user/${userId}`}
            />
            <MenuItem
              title={t('deviceTitle')}
              link="/settings/devices"
              // icon={<SmartphoneIcon />}
              icon={<DevicesTwoToneIcon />}
              selected={location.pathname.startsWith('/settings/device')}
              sx
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              // icon={<CreateIcon />}
              icon={<ModeEditTwoToneIcon />}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            {!features.disableGroups && (
              <MenuItem
                title={t('settingsGroups')}
                link="/settings/groups"
                icon={<FolderOpenTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/group')}
              />
            )}
            {!features.disableDrivers && (
              <MenuItem
                title={t('sharedDrivers')}
                link="/settings/drivers"
                icon={<AccountBoxTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/driver')}
              />
            )}
            {!features.disableCalendars && (
              <MenuItem
                title={t('sharedCalendars')}
                link="/settings/calendars"
                icon={<CalendarMonthTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/calendar')}
              />
            )}
            {!features.disableComputedAttributes && (
              <MenuItem
                title={t('sharedComputedAttributes')}
                link="/settings/attributes"
                icon={<StorageTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/attribute')}
              />
            )}
            {!features.disableMaintenance && (
              <MenuItem
                title={t('sharedMaintenance')}
                link="/settings/maintenances"
                icon={<BuildCircleTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/maintenance')}
              />
            )}
            {!features.disableSavedCommands && (
              <MenuItem
                title={t('sharedSavedCommands')}
                link="/settings/commands"
                icon={<PublishTwoToneIcon />}
                selected={location.pathname.startsWith('/settings/command')}
              />
            )}
            {supportLink && (
              <MenuItem
                title={t('settingsSupport')}
                link={supportLink}
                icon={<HelpIcon />}
              />
            )}
          </>
        )}
      </List>
      {manager && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('serverAnnouncement')}
              link="/settings/announcement"
              icon={<CampaignIcon />}
              selected={location.pathname === '/settings/announcement'}
            />
            {admin && (
              <MenuItem
                title={t('settingsServer')}
                link="/settings/server"
                icon={<StorageIcon />}
                selected={location.pathname === '/settings/server'}
              />
            )}
            <MenuItem
              title={t('settingsUsers')}
              link="/settings/users"
              icon={<PeopleIcon />}
              selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
            />
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;