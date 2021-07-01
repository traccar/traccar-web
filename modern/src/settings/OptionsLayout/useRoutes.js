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
import { getIsAdmin } from '../../selectors';
import t from '../../common/localization';

const adminRoutes = [
  { subheader: t('userAdmin') },
  {
    name: t('settingsServer'),
    href: '/admin/server',
    icon: <StorageIcon />
  },
  {
    name: t('settingsUsers'),
    href: '/admin/users',
    icon: <PeopleIcon />
  },
  {
    name: t('statisticsTitle'),
    href: '/admin/statistics',
    icon: <BarChartIcon />
  }
];

const mainRoutes = [
  {
    name: t('sharedGeofences'),
    href: '/geofences',
    icon: <CreateIcon />
  },
  {
    name: t('sharedNotifications'),
    href: '/settings/notifications',
    icon: <NotificationsIcon />
  },
  {
    name: t('settingsGroups'),
    href: '/settings/groups',
    icon: <FolderIcon />
  },
  {
    name: t('sharedDrivers'),
    href: '/settings/drivers',
    icon: <PersonIcon />
  },
  {
    name: t('sharedComputedAttributes'),
    href: '/settings/attributes',
    icon: <StorageIcon />
  },
  {
    name: t('sharedMaintenance'),
    href: '/settings/maintenances',
    icon: <BuildIcon />
  }
];

export default () => {
  const isAdmin = useSelector(getIsAdmin);
  return useMemo(() => [...mainRoutes, ...(isAdmin ? adminRoutes : [])], [
    isAdmin
  ]);
};
