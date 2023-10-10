import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserManager } from "oidc-client";
import dotenv from "dotenv";
import "../../public/style.css";
dotenv.config();
const env = process.env.NODE_ENV || "development";

const Auth = () => {
  const history = useHistory();

  useEffect(() => {
    const userManager = new UserManager({
      authority: process.env[`${env.toUpperCase()}_AUTHORITY`] || "",
      client_id: process.env[`${env.toUpperCase()}_CLIENT_ID`] || "",
      redirect_uri: process.env[`${env.toUpperCase()}_REDIRECT_URI`] || "",
      response_type: process.env[`${env.toUpperCase()}_RESPONSE_TYPE`] || "",
      scope: process.env[`${env.toUpperCase()}_SCOPE`] || "",
      post_logout_redirect_uri: process.env[`${env.toUpperCase()}_POST_LOGOUT_REDIRECT_URI`] || "",
    });

    userManager.signinRedirectCallback().then(() => {
      history.push("/");
    });
  }, [history]);

  return <div>Redirecting...</div>;
};

export default Auth;
