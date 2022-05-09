import React from 'react';
import {
  Divider, List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import CreateIcon from '@material-ui/icons/Create';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import StorageIcon from '@material-ui/icons/Storage';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import TodayIcon from '@material-ui/icons/Today';
import PublishIcon from '@material-ui/icons/Publish';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator, useReadonly } from '../../common/util/permissions';

const MenuItem = ({
  title, link, icon, selected,
}) => (
  <ListItem button key={link} component={Link} to={link} selected={selected}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={title} />
  </ListItem>
);

const SettingsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const readonly = useReadonly();
  const admin = useAdministrator();
  const userId = useSelector((state) => state.session.user?.id);

  return (
    <>
      <List>
        <MenuItem
          title={t('sharedPreferences')}
          link="/settings/preferences"
          icon={<SettingsIcon />}
          selected={location.pathname === '/settings/preferences'}
        />
        {!readonly && (
          <>
            <MenuItem
              title={t('sharedNotifications')}
              link="/settings/notifications"
              icon={<NotificationsIcon />}
              selected={location.pathname.startsWith('/settings/notification')}
            />
            <MenuItem
              title={t('settingsUser')}
              link={`/settings/user/${userId}`}
              icon={<PersonIcon />}
              selected={location.pathname === `/settings/user/${userId}`}
            />
            <MenuItem
              title={t('sharedGeofences')}
              link="/geofences"
              icon={<CreateIcon />}
              selected={location.pathname.startsWith('/settings/geofence')}
            />
            <MenuItem
              title={t('settingsGroups')}
              link="/settings/groups"
              icon={<FolderIcon />}
              selected={location.pathname.startsWith('/settings/group')}
            />
            <MenuItem
              title={t('sharedDrivers')}
              link="/settings/drivers"
              icon={<PersonIcon />}
              selected={location.pathname.startsWith('/settings/driver')}
            />
            <MenuItem
              title={t('sharedCalendars')}
              link="/settings/calendars"
              icon={<TodayIcon />}
              selected={location.pathname.startsWith('/settings/calendar')}
            />
            <MenuItem
              title={t('sharedComputedAttributes')}
              link="/settings/attributes"
              icon={<StorageIcon />}
              selected={location.pathname.startsWith('/settings/attribute')}
            />
            <MenuItem
              title={t('sharedMaintenance')}
              link="/settings/maintenances"
              icon={<BuildIcon />}
              selected={location.pathname.startsWith('/settings/maintenance')}
            />
            <MenuItem
              title={t('sharedSavedCommands')}
              link="/settings/commands"
              icon={<PublishIcon />}
              selected={location.pathname.startsWith('/settings/command')}
            />
          </>
        )}
      </List>
      {admin && (
        <>
          <Divider />
          <List>
            <MenuItem
              title={t('settingsServer')}
              link="/settings/server"
              icon={<StorageIcon />}
              selected={location.pathname === '/settings/server'}
            />
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
