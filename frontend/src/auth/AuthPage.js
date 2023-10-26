import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "../components/Navbar";
import { useGoogleLogin } from "@react-oauth/google";
import isGoogleTokenValid from "../api/googleTokenCheck";

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const { signIn } = useGoogleLogin();

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
      const { id_token } = await signIn();
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
