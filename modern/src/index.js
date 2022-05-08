import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import { LocalizationProvider } from './common/components/LocalizationProvider';

ReactDOM.render((
  <Provider store={store}>
    <LocalizationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LocalizationProvider>
  </Provider>
), document.getElementById('root'));

serviceWorker.register();
