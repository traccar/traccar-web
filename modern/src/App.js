import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Switch, Route, useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, LinearProgress, useMediaQuery } from '@material-ui/core';
import MainPage from './MainPage';
import RouteReportPage from './reports/RouteReportPage';
import ServerPage from './admin/ServerPage';
import UsersPage from './admin/UsersPage';
import DevicePage from './DevicePage';
import UserPage from './UserPage';
import SocketController from './SocketController';
import NotificationsPage from './settings/NotificationsPage';
import NotificationPage from './settings/NotificationPage';
import GroupsPage from './settings/GroupsPage';
import GroupPage from './settings/GroupPage';
import PositionPage from './PositionPage';
import EventReportPage from './reports/EventReportPage';
import ReplayPage from './reports/ReplayPage';
import TripReportPage from './reports/TripReportPage';
import StopReportPage from './reports/StopReportPage';
import SummaryReportPage from './reports/SummaryReportPage';
import ChartReportPage from './reports/ChartReportPage';
import DriversPage from './settings/DriversPage';
import DriverPage from './settings/DriverPage';
import CalendarsPage from './settings/CalendarsPage';
import CalendarPage from './settings/CalendarPage';
import ComputedAttributesPage from './settings/ComputedAttributesPage';
import ComputedAttributePage from './settings/ComputedAttributePage';
import MaintenancesPage from './settings/MaintenancesPage';
import MaintenancePage from './settings/MaintenancePage';
import CommandsPage from './settings/CommandsPage';
import CommandPage from './settings/CommandPage';
import StatisticsPage from './admin/StatisticsPage';
import CachingController from './CachingController';

import LoginForm from './components/registration/LoginForm';
import RegisterForm from './components/registration/RegisterForm';
import ResetPasswordForm from './components/registration/ResetPasswordForm';

import theme from './theme';
import GeofencesPage from './GeofencesPage';
import GeofencePage from './GeofencePage';
import { LocalizationProvider } from './LocalizationProvider';
import useQuery from './common/useQuery';
import { useEffectAsync } from './reactHelper';
import { devicesActions } from './store';
import EventPage from './EventPage';
import PreferencesPage from './settings/PreferencesPage';
import BottomMenu from './components/BottomMenu';
import AccumulatorsPage from './settings/AccumulatorsPage';
import SendCommandPage from './settings/SendCommandPage';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  page: {
    flexGrow: 1,
    overflow: 'auto',
  },
  menu: {
    zIndex: 4,
  },
}));

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const desktop = useMediaQuery(theme.breakpoints.up('lg'));

  const initialized = useSelector((state) => !!state.session.server && !!state.session.user);
  const [redirectsHandled, setRedirectsHandled] = useState(false);

  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get('token')) {
      const token = query.get('token');
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      history.push('/');
    } else if (query.get('deviceId')) {
      const deviceId = query.get('deviceId');
      const response = await fetch(`/api/devices?uniqueId=${deviceId}`);
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.select(items[0].id));
        }
      }
      history.push('/');
    } else if (query.get('eventId')) {
      const eventId = parseInt(query.get('eventId'), 10);
      history.push(`/event/${eventId}`);
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  return (!redirectsHandled ? (<LinearProgress />) : (
    <LocalizationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SocketController />
        <CachingController />
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/register" component={RegisterForm} />
          <Route exact path="/reset-password" component={ResetPasswordForm} />
          <Route>
            {!initialized ? (<LinearProgress />) : (
              <div className={classes.root}>
                <div className={classes.page}>
                  <Switch>
                    <Route exact path="/" component={MainPage} />
                    <Route exact path="/replay" component={ReplayPage} />
                    <Route exact path="/position/:id?" component={PositionPage} />
                    <Route exact path="/event/:id?" component={EventPage} />
                    <Route exact path="/user/:id?" component={UserPage} />
                    <Route exact path="/device/:id?" component={DevicePage} />
                    <Route exact path="/geofence/:id?" component={GeofencePage} />
                    <Route exact path="/geofences" component={GeofencesPage} />
                    <Route exact path="/settings/accumulators/:deviceId?" component={AccumulatorsPage} />
                    <Route exact path="/settings/preferences" component={PreferencesPage} />
                    <Route exact path="/settings/notifications" component={NotificationsPage} />
                    <Route exact path="/settings/notification/:id?" component={NotificationPage} />
                    <Route exact path="/settings/groups" component={GroupsPage} />
                    <Route exact path="/settings/group/:id?" component={GroupPage} />
                    <Route exact path="/settings/drivers" component={DriversPage} />
                    <Route exact path="/settings/driver/:id?" component={DriverPage} />
                    <Route exact path="/settings/calendars" component={CalendarsPage} />
                    <Route exact path="/settings/calendar/:id?" component={CalendarPage} />
                    <Route exact path="/settings/attributes" component={ComputedAttributesPage} />
                    <Route exact path="/settings/attribute/:id?" component={ComputedAttributePage} />
                    <Route exact path="/settings/maintenances" component={MaintenancesPage} />
                    <Route exact path="/settings/maintenance/:id?" component={MaintenancePage} />
                    <Route exact path="/settings/commands" component={CommandsPage} />
                    <Route exact path="/settings/command/:id?" component={CommandPage} />
                    <Route exact path="/command/:deviceId?" component={SendCommandPage} />
                    <Route exact path="/admin/server" component={ServerPage} />
                    <Route exact path="/admin/users" component={UsersPage} />
                    <Route exact path="/admin/statistics" component={StatisticsPage} />
                    <Route exact path="/reports/route" component={RouteReportPage} />
                    <Route exact path="/reports/event" component={EventReportPage} />
                    <Route exact path="/reports/trip" component={TripReportPage} />
                    <Route exact path="/reports/stop" component={StopReportPage} />
                    <Route exact path="/reports/summary" component={SummaryReportPage} />
                    <Route exact path="/reports/chart" component={ChartReportPage} />
                  </Switch>
                </div>
                {!desktop && (
                  <div className={classes.menu}>
                    <BottomMenu />
                  </div>
                )}
              </div>
            )}
          </Route>
        </Switch>
      </ThemeProvider>
    </LocalizationProvider>
  ));
};

export default App;
