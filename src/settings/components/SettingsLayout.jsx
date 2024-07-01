import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '../../common/components/PageLayout';
import SettingsMenu from './SettingsMenu';

const commondBreadcrumb = 'settingsTitle';

const routes = {
  settings: {
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
  },
};

const compoundRoutes = {
  '^/settings/accumulators/([^/]+)$': ['sharedDeviceAccumulators'],
  '^/settings/calendar/([^/]+)': [commondBreadcrumb, routes.settings.calendar],
  '^/settings/command/([^/]+)': [commondBreadcrumb, routes.settings.command],
  '^/settings/attribute/([^/]+)': [commondBreadcrumb, routes.settings.attribute],
  '^/settings/device/([^/]+)/connections$': [commondBreadcrumb, routes.settings.device, 'sharedConnections'],
  '^/settings/device/([^/]+)/command$': [commondBreadcrumb, 'deviceCommand'],
  '^/settings/device/([^/]+)/share$': ['deviceShare'],
  '^/settings/device/([^/]+)': [commondBreadcrumb, routes.settings.device],
  '^/settings/driver/([^/]+)': [commondBreadcrumb, routes.settings.driver],
  '^/settings/geofence/([^/]+)': [commondBreadcrumb, routes.settings.geofence],
  '^/settings/group/([^/]+)/connections$': [commondBreadcrumb, routes.settings.group, 'sharedConnections'],
  '^/settings/group/([^/]+)/command$': [commondBreadcrumb, 'deviceCommand'],
  '^/settings/group/([^/]+)': [commondBreadcrumb, routes.settings.group],
  '^/settings/maintenance/([^/]+)': [commondBreadcrumb, routes.settings.maintenance],
  '^/settings/notification/([^/]+)': [commondBreadcrumb, routes.settings.notification],
  '^/settings/user/([^/]+)/connections$': [commondBreadcrumb, routes.settings.user, 'sharedConnections'],
  '^/settings/user/([^/]+)': [commondBreadcrumb, routes.settings.user],
};

const generateBreadcrumbs = (pathname, compoundRoutes) => {
  const routeEntry = Object.entries(compoundRoutes).find(([pattern]) => {
    const regex = new RegExp(pattern);
    return regex.test(pathname);
  });

  return routeEntry ? routeEntry[1] : [commondBreadcrumb];
};

const SettingsLayout = () => {
  let breadcrumbs = [];
  const { pathname } = useLocation();
  const pathSegmets = pathname.split('/').filter((p) => p !== '');

  if (pathSegmets.length === 2) breadcrumbs = [commondBreadcrumb, routes[pathSegmets[0]][pathSegmets[1]]];
  if (pathSegmets.length > 2) breadcrumbs = generateBreadcrumbs(pathname, compoundRoutes);

  return (
    <PageLayout
      menu={<SettingsMenu />}
      breadcrumbs={breadcrumbs}
    >
      <Outlet />
    </PageLayout>
  );
};

export default SettingsLayout;
