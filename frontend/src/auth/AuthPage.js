import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import dotenv from "dotenv";
import NavBar from "../components/Navbar";
import { useGoogleAuth } from "@react-oauth/google";

dotenv.config();
const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const { signIn } = useGoogleAuth();

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

  const handleGoogleLogin = async (response) => {
     try {
      await signIn();
      // Handle successful sign-in
    } catch (error) {
      // Handle sign-in error
    }
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
      <button onClick={handleGoogleLogin}>Sign in with Google</button>
      {error && <p>{error}</p>}
    </div>
  );
};


export default AuthPage;
