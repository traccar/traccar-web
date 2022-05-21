import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';

const base = window.location.href.indexOf('modern') >= 0 ? '/modern' : null;

ReactDOM.render((
  <Provider store={store}>
    <LocalizationProvider>
      <BrowserRouter basename={base}>
        <App />
      </BrowserRouter>
    </LocalizationProvider>
  </Provider>
), document.getElementById('root'));

serviceWorker.register();
