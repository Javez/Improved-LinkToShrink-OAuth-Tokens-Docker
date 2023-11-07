import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleLogin = (e) => {
    e.preventDefault();
    // Send login request to backend
    fetch(`${_host}:${_port}/login/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Set authentication token in sessionStorage
          sessionStorage.setItem("token", data.token);
          // Redirect to main page
          history.push("/");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleGoogleLogin = async (response) => {
    try {
      const { id_token } = await useGoogleLogin;
      const result = await isGoogleTokenValid(id_token);
      if (!result) {
        setError("Google token is not valid");
      } else {
        const decodedToken = JSON.parse(atob(id_token.split(".")[1]));
        const email = decodedToken.email;
        const name = decodedToken.name;
        const picture = decodedToken.picture;
        const response = await fetch(`${_host}:${_port}/login/googleuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            name: name,
            picture: picture,
            provider: "google",
          }),
        });
        const data = await response.json();
        if (data.success) {
          // Redirect to main page
          history.push("/login");
        } else {
          setError(data.message);
        }
      }
    } catch (error) {
      // Handle sign-in error
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
              <label htmlFor="email" className="form-container-input_group__label">Email</label>
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
              <label htmlFor="password" className="form-container-input_group__label">
                Password
              </label>
            </div>
            <br />
            <button type="submit" className="btn btn-slim">
              Confirm
            </button>
            <br />
            <Link to="/register">
              <a className="redirect-link">Dont have an account? Register</a>
            </Link>
          </form>
          <br />
          <form className="form-container form-auth-container-btn">
            <button className="btn btn-slim" onClick={handleGoogleLogin}>
              <FontAwesomeIcon icon={faGoogle} className="google-icon" />
              Login with Google
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
