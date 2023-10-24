import React, { useState } from "react";
import NavBar from "../components/Navbar";
import dotenv from "dotenv";
import { useGoogleAuth } from "@react-oauth/google";

dotenv.config();

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;
const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useGoogleAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${_host}:${_port}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json();
    console.log(data);
  };

  const handleGoogleAuth = async () => {
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
    </div>
  );
};

export default RegisterPage;
