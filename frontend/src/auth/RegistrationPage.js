import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import isGoogleTokenValid from "../api/googleTokenCheck";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const RegisterPage = ({ ClientId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${_host}:${_port}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    console.log(data);
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
        const response = await fetch(`${_host}:${_port}/register`, {
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
          <form
            onSubmit={handleSubmit}
            className="form-container form-container-auth"
          >
            <h3>Please enter your data</h3>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="form-container-input_group__label">
                Username
              </label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="form-container-input_group__label">Email</label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="form-container-input_group__label">
                Password
              </label>
            </div>
            <button type="submit" className="btn">
              Sign Up
            </button>
          </form>
          <br />
          <form className="form-container form-auth-container-btn">
            <button className="btn btn-slim" onClick={handleGoogleAuth}>
              <FontAwesomeIcon icon={faGoogle} className="google-icon" />
              Register with Google
            </button>
          </form>
          {error && <p>{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
