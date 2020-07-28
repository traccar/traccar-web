import React from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import ReportPage from './reports/ReportPage';
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
        <Route exact path='/reports/:reportType' component={ReportPage} />
      </Switch>
    </>
  );
}

export default App;
