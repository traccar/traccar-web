import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';
import ErrorHandler from './common/components/ErrorHandler';
import CachingController from './CachingController';
import SocketController from './SocketController';
import theme from './common/theme';
import Navigation from './Navigation';

const base = window.location.href.indexOf('modern') >= 0 ? '/modern' : '/';

ReactDOM.render(
  (
    <Provider store={store}>
      <LocalizationProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter basename={base}>
            <SocketController />
            <CachingController />
            <Navigation />
          </BrowserRouter>
          <ErrorHandler />
        </ThemeProvider>
      </LocalizationProvider>
    </Provider>
  ), document.getElementById('root'),
);

serviceWorker.register();
