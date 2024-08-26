import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import SettingsMenu from './SettingsMenu';

const routes = {
  accumulators: 'sharedDeviceAccumulators',
  announcement: 'serverAnnouncement',
  calendars: 'sharedCalendars',
  calendar: 'sharedCalendar',
  commands: 'sharedSavedCommands',
  command: 'sharedSavedCommand',
  attributes: 'sharedComputedAttributes',
  attribute: 'sharedComputedAttribute',
  devices: 'deviceTitle',
  device: 'sharedDevice',
  drivers: 'sharedDrivers',
  driver: 'sharedDriver',
  geofence: 'sharedGeofence',
  groups: 'settingsGroups',
  group: 'groupDialog',
  maintenances: 'sharedMaintenance',
  maintenance: 'sharedMaintenance',
  notifications: 'sharedNotifications',
  notification: 'sharedNotification',
  preferences: 'sharedPreferences',
  server: 'settingsServer',
  users: 'settingsUsers',
  user: 'settingsUser',
};

const SettingsLayout = () => {
  let breadcrumbs = ['settingsTitle'];
  const { pathname } = useLocation();
  const pathSegmets = pathname?.split('/').filter((p) => p !== '');

  if (pathSegmets?.length >= 2 && pathSegmets?.length <= 3) {
    breadcrumbs.push(routes[pathSegmets[1]]);
  }

  if (pathSegmets?.length === 4) {
    switch (pathSegmets[3]) {
      case 'connections':
        breadcrumbs.push(routes[pathSegmets[1]], 'sharedConnections');
        break;
      case 'command':
        breadcrumbs.push('deviceCommand');
        break;
      case 'share':
        breadcrumbs = ['deviceShare'];
        break;
      default:
        breadcrumbs = ['settingsTitle'];
    }
  }

  return (
    <PageLayout menu={<SettingsMenu />} breadcrumbs={breadcrumbs}>
      <Outlet />
    </PageLayout>
  );
};

export default SettingsLayout;
