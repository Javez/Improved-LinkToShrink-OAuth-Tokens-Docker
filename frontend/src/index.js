import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import MainPage from "./components/MainPage";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/auth" component={AuthPage} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
