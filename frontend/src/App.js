import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { UserManager, WebStorageStateStore } from "oidc-client";
import AuthPage from "./components/auth";
import MainPage from "./components/main";
import dotenv from "dotenv";
import "../../public/style.css";

dotenv.config();
const env = process.env.NODE_ENV || "development";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userManager = new UserManager({
      authority: process.env[`${env.toUpperCase()}_AUTHORITY`] || "",
      client_id: process.env[`${env.toUpperCase()}_CLIENT_ID`] || "",
      redirect_uri: process.env[`${env.toUpperCase()}_REDIRECT_URI`] || "",
      response_type: process.env[`${env.toUpperCase()}_RESPONSE_TYPE`] || "",
      scope: process.env[`${env.toUpperCase()}_SCOPE`] || "",
      post_logout_redirect_uri:
      process.env[`${env.toUpperCase()}_POST_LOGOUT_REDIRECT_URI`] || "",
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      client_secret: process.env[`${env.toUpperCase()}_CLIENT_SECRET`] || "",
    });

    userManager.getUser().then((user) => {
      setUser(user);
    });

    userManager.events.addUserLoaded((user) => {
      setUser(user);
    });

    userManager.events.addUserUnloaded(() => {
      setUser(null);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/auth">{user ? <Redirect to="/" /> : <AuthPage />}</Route>
        <Route path="/">{user ? <MainPage /> : <Redirect to="/auth" />}</Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default App;
