import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

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
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        response.ok ? console.log("All data sended") : console.log("some problem at sending data");
        console.log(await response.body);
      }
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

  const handleGoogleAuth = async (response) => {
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
        const response = await fetch(`${_host}:${_port}/register/googleuser`, {
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
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="text"
                value={username}
                id="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label
                htmlFor="username"
                className="form-container-input_group__label"
              >
                Username
              </label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="form-container-input_group__label"
              >
                Email
              </label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="form-container-input_group__label"
              >
                Password
              </label>
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
            <button className="btn btn-slim" onClick={handleGoogleAuth}>
              <FontAwesomeIcon icon={faGoogle} className="google-icon" />
              Register with Google
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
