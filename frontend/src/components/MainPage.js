import React, { useState } from "react";
import dotenv from "dotenv";
import { NavBar } from "../components/Navbar";
dotenv.config();
const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const MainPage = () => {
  const [link, setLink] = useState("");
  const [shortLink, setShortLink] = useState("");

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleTakeShortLink = (e) => {
    setShortLink(e.target.value);
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    // Send link to backend
    fetch(`${_host}:${_port}/shrinkUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify({ link }),
    })
      .then((res) => res.json())
      .then((data) => {
        handleTakeShortLink(data.shortLink);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <NavBar />
      <h1>Main Page</h1>
      <label>
        Insert a link to shorten:
        <input type="text" value={link} onChange={handleLinkChange} />
      </label>
      <br />
      <label>
        Your link is:
        <a href={shortLink}>{shortLink}</a>
      </label>
      <button type="submit" onClick={handleLinkSubmit}>
        Shorten Link
      </button>
    </div>
  );
};

export default MainPage;
