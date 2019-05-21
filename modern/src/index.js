import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

import registerServiceWorker from "./registerServiceWorker";

import rootReducer from "./reducers";
import App from "./App";
import { AuthProvider, UserProvider } from "./context/auth";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
