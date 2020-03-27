import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './MainPage';
import LoginPage from './LoginPage';
import RouteReportPage from './RouteReportPage';
import DevicePage from './DevicePage';

class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline />
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/device' component={DevicePage} />
          <Route exact path='/reports/route' component={RouteReportPage} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
