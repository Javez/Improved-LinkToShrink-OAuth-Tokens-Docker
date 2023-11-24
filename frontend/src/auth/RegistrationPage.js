import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const _google_cliend_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const _host = process.env.REACT_APP_BACKEND_HOST;
const _port = process.env.REACT_APP_BACKEND_PORT;

const RegisterPage = ({ ClientId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegistration = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await fetch(`http://${_host}:${_port}/register/user`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        console.error(
          "Registration error:",
          response.status,
          response.statusText
        );
      } else {
        response.ok
          ? console.log("All data sended")
          : console.log("some problem at sending data");
        history.push("/login", {
          success: "Registration successful. Please log in.",
        });
      }
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

  const onSuccessGoogleLogin = async (res) => {
    try {
      const userObject = jwt_decode(res.credential);
      const token = res.credential;
      const { name, sub, picture, email } = userObject;
      const doc = {
        _id: sub,
        _type: "user",
        username: name,
        image: picture,
        email: email,
        token: token,
      };

      const result = await isGoogleTokenValid(doc.token);
      if (!result) {
        setError("Google token is not valid");
      } else {
        const formData = new FormData();
        formData.append("username", doc.username);
        formData.append("email", doc.email);
        fetch(`http://${_host}:${_port}/auth/googleuser`, {
          method: "POST",
          credentials: "include",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              sessionStorage.setItem("token", data.token);
              sessionStorage.setItem("username", data.username);
              sessionStorage.setItem("picUrl", picture);
              history.push("/");
            } else {
              setError(data.message);
            }
          })
          .catch((error) => {
            setError(error.message);
          });
      }
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

  const onFailureGoogleLogin = async (res) => {
    if (res.error === "idpiframe_initialization_failed") {
      console.error("Google API initialization failed:", res.details);
      setError(res.details);
    } else {
      console.error("Google Login failed:", res);
    }
  };

  return (
    <div className="main-container">
      <header className="header-container">
        <h1>Sign Up</h1>
      </header>
      <div className="main-block">
        <section className="section-auth-form">
          {error && (
            <div className="error-block">
              <p className="error">{error}</p>
            </div>
          )}
          <form
            onSubmit={handleRegistration}
            className="form-container form-container-auth"
          >
            <h3>Please enter your data</h3>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input authentication"
                placeholder="https://example.com"
                type="username"
                id="username"
                name="username"
                pattern="^[a-zA-Z][a-zA-Z0-9]{3,}$"
                required
                title="Username must be at least 4 characters long and contain only letters, numbers"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label
                htmlFor="username"
                className="form-container-input_group__label"
              >
                Username
              </label>
              <FontAwesomeIcon
                className="exclamation-icon"
                icon={faExclamationTriangle}
              />
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input authentication"
                placeholder="https://example.com"
                type="email"
                id="email"
                name="email"
                pattern="^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
                required
                title="Please enter a valid email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="form-container-input_group__label"
              >
                Email
              </label>
              <FontAwesomeIcon
                className="exclamation-icon"
                icon={faExclamationTriangle}
              />
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input authentication"
                placeholder="https://example.com"
                type="password"
                id="password"
                name="password"
                pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                required
                title="Password must be at least 8 characters long and contain at least one digit, one lower case letter, and one upper case letter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="form-container-input_group__label authentication"
              >
                Password
              </label>
              <FontAwesomeIcon
                className="exclamation-icon"
                icon={faExclamationTriangle}
              />
            </div>
            <button type="submit" className="btn btn-slim">
              Confirm
            </button>
            <Link to="/login">
              <p className="redirect-link">Already have account? Sing In</p>
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
                    Continue with google
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

export default RegisterPage;
