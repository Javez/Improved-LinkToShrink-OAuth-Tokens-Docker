import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import MainPage from "./components/MainPage";
import RegisterPage from "./auth/RegistrationPage";
import { GoogleProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <GoogleProvider clientId={GOOGLE_CLIENT_ID}>
          <Route exact path="/login" component={AuthPage} />
          <Route exact path="/register" component={RegisterPage} />
        </GoogleProvider>
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
