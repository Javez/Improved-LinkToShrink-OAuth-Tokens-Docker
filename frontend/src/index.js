import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import MainPage from "./components/MainPage";
import NotFoundPage from "./components/NotFoundPage";
import RegisterPage from "./auth/RegistrationPage";
import "./sass/main.scss";

import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

const App = () => {
  return (
    <BrowserRouter>
      <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={AuthPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
