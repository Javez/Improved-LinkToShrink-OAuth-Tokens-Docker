import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AuthPage from "./auth/AuthPage";
import MainPage from "./components/MainPage";
import RegisterPage from "./auth/RegistrationPage";
import "./sass/main.scss";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

const App = () => {
  return (
    <GoogleOAuthProvider client_id={process.env.GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Router>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={AuthPage} />
          <Route exact path="/register" component={RegisterPage} />
        </Router>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
