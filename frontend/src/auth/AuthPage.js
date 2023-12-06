import React, { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { jwtDecode as jwt_decode } from "jwt-decode";

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
    if (location.state && location.state.success) {
      setSuccess(location.state.success);
    }
  }, [location]);

  const handleLogin = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      fetch(`http://${_host}:${_port}/login/user`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("username", data.username);
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
              console.log(data);
              sessionStorage.setItem("token", data.token);
              sessionStorage.setItem("username", data.username);
              sessionStorage.setItem("picUrl", picture);
              console.log(sessionStorage.getItem("token"));
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
                className="form-container-input_group__input authentication"
                placeholder="https://example.com"
                type="email"
                id="email"
                name="email"
                pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
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
              <br />
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input authentication"
                placeholder="password"
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
                    name="sign in with google"
                    value={"Sign in with google"}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="google-icon" />
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
