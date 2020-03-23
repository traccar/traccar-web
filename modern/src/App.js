import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline';
import MainPage from './MainPage';
import LoginPage from './LoginPage';

class App extends Component {
  render() {
    return (
      <Fragment>
        <CssBaseline />
        <Switch>
          <Route exact path='/' component={MainPage} />
          <Route exact path='/login' component={LoginPage} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
