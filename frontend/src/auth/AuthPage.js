import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const _host = process.env.REACT_APP_BACKEND_HOST;
const _port = process.env.REACT_APP_BACKEND_PORT;
const _google_cliend_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    // Check for the success message in the location state
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
    }
  }, [location]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Send login request to backend
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    try {
      fetch(`http://${_host}:${_port}/login/user`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            // Set authentication token in sessionStorage
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", data.username);
            // Redirect to main page
            history.push("/");
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

  const onSuccessGoogleLogin = async (event) => {
    event.preventDefault();
    ///TEST
    console.log("res:", event);
    console.log("res.tokenId:", event.tokenId);
    console.log(
      "res.getAuthResponse().id_token",
      event.getAuthResponse().id_token
    );
    console.log("Login Success: currentUser:", event.profileObj);
    console.log("token:", event.tokenObj);

    try {
      const id_token = event.tokenId;
      const result = await isGoogleTokenValid(id_token);
      if (!result) {
        setError("Google token is not valid");
      } else {
        console.log(
          `Logged in successfully welcome ${event.profileObj.name} 😍. \n See console for full profile object.`
        );
        const decodedToken = JSON.parse(atob(id_token.split(".")[1]));
        const newEmail = decodedToken.email;
        const newName = decodedToken.name;
        const newPicture = decodedToken.picture;
        ///TEST
        console.log(
          "Test user data from token: ",
          newName,
          newEmail,
          newPicture
        );
        const formData = new FormData();
        formData.append("username", newName);
        formData.append("email", newEmail);
        ///TEST
        console.log("Test formData: ", formData);
        const response = await fetch(
          `http://${_host}:${_port}/auth/googleuser`,
          {
            method: "POST",
            credentials: "include",
            body: formData,
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          response.ok
            ? console.log("All data sended")
            : console.log("some problem at sending data");
          history.push("/", {
            success: "Registration successful. Please log in.",
          });
        }
      }
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

  const onFailureGoogleLogin = async (response) => {
    if (response.error === "idpiframe_initialization_failed") {
      console.error("Google API initialization failed:", response.details);
      setError(response.details);
    } else {
      // Handle other types of errors
      console.error("Google Login failed:", response);
    }
  };

  return (
    <div className="main-container">
      <header className="header-container">
        <h1>Sign In</h1>
      </header>
      <div className="main-block">
        <section className="section-auth-form">
          {error && (
            <div className="error-block">
              <p className="error">{error}</p>
            </div>
          )}
          {success && (
            <div className="success-block">
              <p className="success">{success}</p>
            </div>
          )}
          <form
            className="form-container form-container-auth"
            onSubmit={handleLogin}
          >
            <h3>Please enter your data</h3>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="form-container-input_group__label"
              >
                Email
              </label>
              <br />
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className="form-container-input_group__label"
              >
                Password
              </label>
            </div>
            <br />
            <button type="submit" className="btn btn-slim">
              Confirm
            </button>
            <br />
            <Link to="/register">
              <p className="redirect-link">Dont have an account? Register</p>
            </Link>
          </form>
          <br />
          <form className="form-container form-auth-container-btn">
            <GoogleOAuthProvider clientId={_google_cliend_id}>
              <GoogleLogin
                render={(renderProps) => (
                  <button
                    type="button"
                    className="btn btn-slim"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                    Sign in with google
                  </button>
                )}
                onSuccess={onSuccessGoogleLogin}
                onFailure={onFailureGoogleLogin}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
