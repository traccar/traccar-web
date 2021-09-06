import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import CreateIcon from '@material-ui/icons/Create';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import StorageIcon from '@material-ui/icons/Storage';
import BuildIcon from '@material-ui/icons/Build';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import TodayIcon from '@material-ui/icons/Today';
import { getIsAdmin, getUserId } from '../../common/selectors';
import { useTranslation } from '../../LocalizationProvider';

const useAdminRoutes = (t) => useMemo(() => [
  { subheader: t('userAdmin') },
  {
    name: t('settingsServer'),
    href: '/admin/server',
    icon: <StorageIcon />,
  },
  {
    name: t('settingsUsers'),
    href: '/admin/users',
    icon: <PeopleIcon />,
  },
  {
    name: t('statisticsTitle'),
    href: '/admin/statistics',
    icon: <BarChartIcon />,
  },
], [t]);

const useMainRoutes = (t, userId) => useMemo(() => [
  {
    name: t('settingsUser'),
    href: `/user/${userId}`,
    icon: <PersonIcon />,
  },
  {
    match: 'geofence',
    name: t('sharedGeofences'),
    href: '/geofences',
    icon: <CreateIcon />,
  },
  {
    match: 'notification',
    name: t('sharedNotifications'),
    href: '/settings/notifications',
    icon: <NotificationsIcon />,
  },
  {
    match: 'group',
    name: t('settingsGroups'),
    href: '/settings/groups',
    icon: <FolderIcon />,
  },
  {
    match: 'driver',
    name: t('sharedDrivers'),
    href: '/settings/drivers',
    icon: <PersonIcon />,
  },
  {
    match: 'calendar',
    name: t('sharedCalendars'),
    href: '/settings/calendars',
    icon: <TodayIcon />,
  },
  {
    match: 'attribute',
    name: t('sharedComputedAttributes'),
    href: '/settings/attributes',
    icon: <StorageIcon />,
  },
  {
    match: 'maintenance',
    name: t('sharedMaintenance'),
    href: '/settings/maintenances',
    icon: <BuildIcon />,
  },
], [t, userId]);

export default () => {
  const t = useTranslation();

  const isAdmin = useSelector(getIsAdmin);
  const userId = useSelector(getUserId);

  const mainRoutes = useMainRoutes(t, userId);
  const adminRoutes = useAdminRoutes(t);

  return useMemo(() => [...mainRoutes, ...(isAdmin ? adminRoutes : [])], [
    mainRoutes, isAdmin, adminRoutes,
  ]);
};
