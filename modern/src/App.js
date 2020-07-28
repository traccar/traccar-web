import React from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RouteReportPage from './reports/RouteReportPage';
import TripsReportPage from './reports/TripsReportPage';
import DevicePage from './DevicePage';
import SocketController from './SocketController';

const App = () => {
  return (
    <>
      <CssBaseline />
      <SocketController />
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/device/:id?' component={DevicePage} />
        <Route exact path='/reports/route' component={RouteReportPage} />
        <Route exact path='/reports/trips' component={TripsReportPage} />
      </Switch>
    </>
  );
}

export default App;
