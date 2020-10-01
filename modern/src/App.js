import React from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
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

const App = () => {
  return (
    <>
      <CssBaseline />
      <SocketController />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/position/:id?' component={PositionPage} />
        <Route exact path='/user/:id?' component={UserPage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/reports/route' component={RouteReportPage} />
        <Route exact path='/settings/notifications' component={NotificationsPage} />
        <Route exact path='/settings/notification/:id?' component={NotificationPage} />
        <Route exact path='/settings/groups' component={GroupsPage} />
        <Route exact path='/settings/group/:id?' component={GroupPage} />
        <Route exact path='/admin/server' component={ServerPage} />
        <Route exact path='/admin/users' component={UsersPage} />
      </Switch>
    </>
  );
}

export default App;
