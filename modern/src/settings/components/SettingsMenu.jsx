import React from 'react';
import {
  Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CreateIcon from '@mui/icons-material/Create';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';
import TodayIcon from '@mui/icons-material/Today';
import PublishIcon from '@mui/icons-material/Publish';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import HelpIcon from '@mui/icons-material/Help';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../common/components/LocalizationProvider';
import {
  useAdministrator, useManager, useRestriction,
} from '../../common/util/permissions';
import useFeatures from '../../common/util/useFeatures';
import availableOptions from '../../availableOptions';

let listItems = [];
if (availableOptions.SettingsMenu?.listItems) {
	listItems = availableOptions.SettingsMenu?.listItems;
} else {
	listItems = [
		'sharedPreferences',
		'sharedNotifications',
		'settingsUser',
		'deviceTitle',
		'sharedGeofences',
		'settingsGroups',
		'sharedDrivers',
		'sharedCalendars',
		'sharedComputedAttributes',
		'sharedMaintenance',
		'sharedSavedCommands',
		'settingsSupport',
		'settingsServer',
		'settingsUsers'
	];
}

const MenuItem = ({
  title, link, icon, selected,
}) => (
  <ListItemButton key={link} component={Link} to={link} selected={selected}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText primary={title} />
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
	  	{
			listItems.includes('sharedPreferences') &&
			<MenuItem
				title={t('sharedPreferences')}
				link="/settings/preferences"
				icon={<SettingsIcon />}
				selected={location.pathname === '/settings/preferences'}
			/>		
		}
        {
			!readonly &&
			(
				<>
					{
						listItems.includes('sharedNotifications') &&
						<MenuItem
							title={t('sharedNotifications')}
							link="/settings/notifications"
							icon={<NotificationsIcon />}
							selected={location.pathname.startsWith('/settings/notification')}
						/>					
					}
					{
						listItems.includes('settingsUser') &&
						<MenuItem
							title={t('settingsUser')}
							link={`/settings/user/${userId}`}
							icon={<PersonIcon />}
							selected={location.pathname === `/settings/user/${userId}`}
						/>					
					}
					{
						listItems.includes('deviceTitle') &&
						<MenuItem
							title={t('deviceTitle')}
							link="/settings/devices"
							icon={<SmartphoneIcon />}
							selected={location.pathname.startsWith('/settings/device')}
						/>					
					}
					{
						listItems.includes('sharedGeofences') &&
						<MenuItem
							title={t('sharedGeofences')}
							link="/geofences"
							icon={<CreateIcon />}
							selected={location.pathname.startsWith('/settings/geofence')}
						/>					
					}
					{
					
						!features.disableGroups && listItems.includes('settingsGroups') &&
						<MenuItem
							title={t('settingsGroups')}
							link="/settings/groups"
							icon={<FolderIcon />}
							selected={location.pathname.startsWith('/settings/group')}
						/>
					}
					{
						!features.disableDrivers && listItems.includes('sharedDrivers') &&
						<MenuItem
							title={t('sharedDrivers')}
							link="/settings/drivers"
							icon={<PersonIcon />}
							selected={location.pathname.startsWith('/settings/driver')}
						/>
					}
					{
						!features.disableCalendars && listItems.includes('sharedCalendars') &&
						<MenuItem
							title={t('sharedCalendars')}
							link="/settings/calendars"
							icon={<TodayIcon />}
							selected={location.pathname.startsWith('/settings/calendar')}
						/>
					}
					{
						!features.disableComputedAttributes && listItems.includes('sharedComputedAttributes') &&
						<MenuItem
							title={t('sharedComputedAttributes')}
							link="/settings/attributes"
							icon={<StorageIcon />}
							selected={location.pathname.startsWith('/settings/attribute')}
						/>
					}
					{
						!features.disableMaintenance && listItems.includes('sharedMaintenance') &&
						<MenuItem
							title={t('sharedMaintenance')}
							link="/settings/maintenances"
							icon={<BuildIcon />}
							selected={location.pathname.startsWith('/settings/maintenance')}
						/>
					}
					{
						listItems.includes('sharedSavedCommands') &&
						<MenuItem
							title={t('sharedSavedCommands')}
							link="/settings/commands"
							icon={<PublishIcon />}
							selected={location.pathname.startsWith('/settings/command')}
						/>
					}
					{
						supportLink && listItems.includes('settingsSupport') &&
						<MenuItem
							title={t('settingsSupport')}
							link={supportLink}
							icon={<HelpIcon />}
						/>
					}
				</>
			)
		}
      </List>
      {manager && (
        <>
          <Divider />
          <List>
            {
				admin && listItems.includes('settingsServer') &&
				<MenuItem
					title={t('settingsServer')}
					link="/settings/server"
					icon={<StorageIcon />}
					selected={location.pathname === '/settings/server'}
				/>
			}
			{
				listItems.includes('settingsUsers') &&
				<MenuItem
					title={t('settingsUsers')}
					link="/settings/users"
					icon={<PeopleIcon />}
					selected={location.pathname.startsWith('/settings/user') && location.pathname !== `/settings/user/${userId}`}
				/>			
			}
          </List>
        </>
      )}
    </>
  );
};

export default SettingsMenu;
