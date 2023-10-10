import React, { useState } from "react";
import axios from "axios";
import "../../public/style.css";
const Main = () => {
  const [longLink, setLongLink] = useState("");
  const [shortLink, setShortLink] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/shorten", { longLink });
      setShortLink(response.data.shortLink);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
      <main>
        <h1>Shorten your links</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Long link:
            <input
              type="text"
              value={longLink}
              onChange={(e) => setLongLink(e.target.value)}
            />
          </label>
          <button type="submit">Shorten</button>
        </form>
        {shortLink && (
          <p>
            Short link: <a href={shortLink}>{shortLink}</a>
          </p>
        )}
      </main>
    </>
  );
};

export default Main;
