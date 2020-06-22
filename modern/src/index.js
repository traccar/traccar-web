import 'typeface-roboto'
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
), document.getElementById('root'));

serviceWorker.register();
