import React, { useState, useEffect } from "react";

const AuthContext = React.createContext();
const UserContext = React.createContext();

/**
 * User context provider
 *  - Providers data and behavior for the useUser() custom hook
 */
export const UserProvider = props => (
  <UserContext.Provider value={useAuth().data.user} {...props} />
);

/**
 * Custom Hook for accessing authenticated user
 */
export const useUser = () => React.useContext(UserContext);

/**
 * Auth context provider
 *  - Providers data and behavior for the useAuth() custom hook
 */
export function AuthProvider(props) {
  let [data, setData] = useState({});
  let [fetchingAuthState, setFetchingAuthState] = useState(true);

  useEffect(() => {
    checkLogin()
      .then(user => {
        setData({ user });
      })
      .catch(error => {
        setData({ error });
      })
      .finally(() => {
        setFetchingAuthState(false);
      });
  }, []);

  if (fetchingAuthState) {
    return <div id="spinner" />;
  }

  const login = async (email, password) => {
    let user = await loginUser(email, password);
    if (user) {
      setData({ user });
    }
  };

  const logout = async () => {
    await logoutUser();
    setData({});
  };

  const register = async (name, email, password) =>
    registerUser(name, email, password);

  // NOTE: not bothering to optimize with React.useMemo here because this is
  //       the top-most component rendered in our app and it will very rarely
  //       re-render/cause a performance problem.
  return (
    <AuthContext.Provider
      value={{ data, login, logout, register }}
      {...props}
    />
  );
}

/**
 * Custom Hook for accessing auth data and actions
 */
export const useAuth = () => React.useContext(AuthContext);

/* Helper Functions */

/**
 * Create a user via rest API
 */
async function registerUser(name, email, password) {
  let response = await fetch("/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, name, password })
  });
  return response.json();
}

/**
 * Login a user via rest API
 */
async function loginUser(email, password) {
  let response = await fetch("/api/session", {
    method: "POST",
    body: new URLSearchParams(`email=${email}&password=${password}`),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
  return response.json();
}

/**
 * Delete session (logout) via rest API
 */
async function logoutUser() {
  let response = await fetch("/api/session", {
    method: "DELETE"
  });
  return response.ok;
}

/**
 * Verify session via rest API
 */
async function checkLogin() {
  let response = await fetch("/api/session");
  if (!response.ok) {
    return;
  }
  return response.json();
}
