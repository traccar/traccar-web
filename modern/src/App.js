import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Switch, Route, useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, LinearProgress, useMediaQuery } from '@material-ui/core';
import MainPage from './main/MainPage';
import RouteReportPage from './reports/RouteReportPage';
import ServerPage from './settings/ServerPage';
import UsersPage from './settings/UsersPage';
import DevicePage from './settings/DevicePage';
import UserPage from './settings/UserPage';
import SocketController from './SocketController';
import NotificationsPage from './settings/NotificationsPage';
import NotificationPage from './settings/NotificationPage';
import GroupsPage from './settings/GroupsPage';
import GroupPage from './settings/GroupPage';
import PositionPage from './other/PositionPage';
import EventReportPage from './reports/EventReportPage';
import ReplayPage from './other/ReplayPage';
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
import StatisticsPage from './reports/StatisticsPage';
import CachingController from './CachingController';

import LoginPage from './login/LoginPage';
import RegisterPage from './login/RegisterPage';
import ResetPasswordPage from './login/ResetPasswordPage';

import theme from './common/theme';
import GeofencesPage from './other/GeofencesPage';
import GeofencePage from './settings/GeofencePage';
import useQuery from './common/util/useQuery';
import { useEffectAsync } from './reactHelper';
import { devicesActions } from './store';
import EventPage from './other/EventPage';
import PreferencesPage from './settings/PreferencesPage';
import BottomMenu from './common/components/BottomMenu';
import AccumulatorsPage from './settings/AccumulatorsPage';
import CommandSendPage from './settings/CommandSendPage';
import ErrorHandler from './common/components/ErrorHandler';

const useStyles = makeStyles(() => ({
  page: {
    flexGrow: 1,
    overflow: 'auto',
  },
  menu: {
    zIndex: 1204,
  },
}));

const App = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

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
      } else {
        throw Error(await response.text());
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SocketController />
      <CachingController />
      <Switch>
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/reset-password" component={ResetPasswordPage} />
        <Route>
          {!initialized ? (<LinearProgress />) : (
            <>
              <div className={classes.page}>
                <Switch>
                  <Route exact path="/" component={MainPage} />

                  <Route exact path="/position/:id?" component={PositionPage} />
                  <Route exact path="/event/:id?" component={EventPage} />
                  <Route exact path="/replay" component={ReplayPage} />
                  <Route exact path="/geofences" component={GeofencesPage} />

                  <Route exact path="/settings/accumulators/:deviceId?" component={AccumulatorsPage} />
                  <Route exact path="/settings/calendars" component={CalendarsPage} />
                  <Route exact path="/settings/calendar/:id?" component={CalendarPage} />
                  <Route exact path="/settings/commands" component={CommandsPage} />
                  <Route exact path="/settings/command/:id?" component={CommandPage} />
                  <Route exact path="/settings/command-send/:deviceId?" component={CommandSendPage} />
                  <Route exact path="/settings/attributes" component={ComputedAttributesPage} />
                  <Route exact path="/settings/attribute/:id?" component={ComputedAttributePage} />
                  <Route exact path="/settings/device/:id?" component={DevicePage} />
                  <Route exact path="/settings/drivers" component={DriversPage} />
                  <Route exact path="/settings/driver/:id?" component={DriverPage} />
                  <Route exact path="/settings/geofence/:id?" component={GeofencePage} />
                  <Route exact path="/settings/groups" component={GroupsPage} />
                  <Route exact path="/settings/group/:id?" component={GroupPage} />
                  <Route exact path="/settings/maintenances" component={MaintenancesPage} />
                  <Route exact path="/settings/maintenance/:id?" component={MaintenancePage} />
                  <Route exact path="/settings/notifications" component={NotificationsPage} />
                  <Route exact path="/settings/notification/:id?" component={NotificationPage} />
                  <Route exact path="/settings/preferences" component={PreferencesPage} />
                  <Route exact path="/settings/server" component={ServerPage} />
                  <Route exact path="/settings/users" component={UsersPage} />
                  <Route exact path="/settings/user/:id?" component={UserPage} />

                  <Route exact path="/reports/chart" component={ChartReportPage} />
                  <Route exact path="/reports/event" component={EventReportPage} />
                  <Route exact path="/reports/route" component={RouteReportPage} />
                  <Route exact path="/reports/statistics" component={StatisticsPage} />
                  <Route exact path="/reports/stop" component={StopReportPage} />
                  <Route exact path="/reports/summary" component={SummaryReportPage} />
                  <Route exact path="/reports/trip" component={TripReportPage} />
                </Switch>
              </div>
              {!desktop && (
                <div className={classes.menu}>
                  <BottomMenu />
                </div>
              )}
            </>
          )}
        </Route>
      </Switch>
      <ErrorHandler />
    </ThemeProvider>
  ));
};

export default App;
