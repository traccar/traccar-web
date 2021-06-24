import 'typeface-roboto'
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './store';
import LanguageProvider from "./LanguageProvider";

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </HashRouter>
  </Provider>
), document.getElementById('root'));

serviceWorker.register();
