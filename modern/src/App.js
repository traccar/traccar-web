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

const App = () => {
  return (
    <>
      <CssBaseline />
      <SocketController />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/user/:id?' component={UserPage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/reports/route' component={RouteReportPage} />
        <Route exact path='/admin/server' component={ServerPage} />
        <Route exact path='/admin/users' component={UsersPage} />
      </Switch>
    </>
  );
}

export default App;
