import React, { useState } from "react";
import GoogleLogin from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import dotenv from "dotenv";
import NavBar from "../components/Navbar";

dotenv.config();
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
    fetch(`${_host}:${_port}/login`, {
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

  const handleGoogleLogin = (response) => {
    // Send Google login request to backend

    fetch(`${_host}:${_port}/api/google-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenId: response.tokenId }),
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

  return (
    <div>
      <NavBar />
      <h1>Sign In</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
      <br />
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={handleGoogleLogin}
        onFailure={(error) => setError(error.message)}
        cookiePolicy={"single_host_origin"}
      />
      {error && <p>{error}</p>}
    </div>
  );
};

export default AuthPage;
