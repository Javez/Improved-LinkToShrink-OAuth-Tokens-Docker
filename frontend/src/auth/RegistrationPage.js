import React, { useState } from "react";
import NavBar from "../components/Navbar";
import { useGoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import isGoogleTokenValid from "../api/googleTokenCheck";

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useGoogleLogin();
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
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <br />
      <button onClick={handleGoogleAuth}>Register with Google</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;
