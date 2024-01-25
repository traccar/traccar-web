import React from 'react';
import {
  Divider, List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import TimelineIcon from '@mui/icons-material/Timeline';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BarChartIcon from '@mui/icons-material/BarChart';
import RouteIcon from '@mui/icons-material/Route';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import NotesIcon from '@mui/icons-material/Notes';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../common/components/LocalizationProvider';
import { useAdministrator, useRestriction } from '../../common/util/permissions';
import availableOptions from '../../availableOptions';

let listItems = [];
if (availableOptions.ReportsMenu?.listItems) {
	listItems = availableOptions.ReportsMenu?.listItems;
} else {
	listItems = [
		'reportCombined',
		'reportRoute',
		'reportEvents',
		'reportTrips',
		'reportStops',
		'reportSummary',
		'reportChart',
		'reportReplay',
		'sharedLogs',
		'reportScheduled',
		'statisticsTitle'
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

const ReportsMenu = () => {
  const t = useTranslation();
  const location = useLocation();

  const admin = useAdministrator();
  const readonly = useRestriction('readonly');

  return (
    <>
      <List>
	    {
			listItems.includes('reportCombined') &&
			<MenuItem
				title={t('reportCombined')}
				link="/reports/combined"
				icon={<StarIcon />}
				selected={location.pathname === '/reports/combined'}
			/>
		}
		{
			listItems.includes('reportRoute') &&
			<MenuItem
				title={t('reportRoute')}
				link="/reports/route"
				icon={<TimelineIcon />}
				selected={location.pathname === '/reports/route'}
			/>		
		}
		{
			listItems.includes('reportEvents') &&
			<MenuItem
				title={t('reportEvents')}
				link="/reports/event"
				icon={<NotificationsActiveIcon />}
				selected={location.pathname === '/reports/event'}
			/>		
		}
		{
			listItems.includes('reportTrips') &&
			<MenuItem
				title={t('reportTrips')}
				link="/reports/trip"
				icon={<PlayCircleFilledIcon />}
				selected={location.pathname === '/reports/trip'}
			/>
		}
		{
			listItems.includes('reportStops') &&
			<MenuItem
				title={t('reportStops')}
				link="/reports/stop"
				icon={<PauseCircleFilledIcon />}
				selected={location.pathname === '/reports/stop'}
			/>		
		}
		{
			listItems.includes('reportSummary') &&
			<MenuItem
				title={t('reportSummary')}
				link="/reports/summary"
				icon={<FormatListBulletedIcon />}
				selected={location.pathname === '/reports/summary'}
			/>		
		}
		{
			listItems.includes('reportChart') &&
			<MenuItem
				title={t('reportChart')}
				link="/reports/chart"
				icon={<TrendingUpIcon />}
				selected={location.pathname === '/reports/chart'}
			/>		
		}
		{
			listItems.includes('reportReplay') &&
			<MenuItem
				title={t('reportReplay')}
				link="/replay"
				icon={<RouteIcon />}
			/>		
		}
      </List>
      <Divider />
      <List>
	  	{
			listItems.includes('sharedLogs') &&
			<MenuItem
				title={t('sharedLogs')}
				link="/reports/logs"
				icon={<NotesIcon />}
				selected={location.pathname === '/reports/logs'}
			/>
		}
        {
			!readonly && listItems.includes('reportScheduled') &&
			<MenuItem
				title={t('reportScheduled')}
				link="/reports/scheduled"
				icon={<EventRepeatIcon />}
				selected={location.pathname === '/reports/scheduled'}
			/>
        }
        {
			admin && listItems.includes('statisticsTitle') &&
			<MenuItem
				title={t('statisticsTitle')}
				link="/reports/statistics"
				icon={<BarChartIcon />}
				selected={location.pathname === '/reports/statistics'}
			/>
		}
      </List>
    </>
  );
};

export default ReportsMenu;
