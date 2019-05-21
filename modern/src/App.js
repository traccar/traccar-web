import React, { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import { useUser } from "./context/auth";

import "./App.css";

/**
 * Top-level Application
 * @type: React Component
 */
function App() {
  let user = useUser();
  return (
    <Fragment>
      <CssBaseline />
      {user ? <MainPage /> : <LoginPage />}
    </Fragment>
  );
}

export default App;
