import React, { useState } from "react";
const LinkForm = (props) => {
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
    fetch(`${props._host}:${props._port}/shrinkUrl`, {
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
    <div className="link-form-container">
      <h1>Insert a link to reduce:</h1>
      <label>
        <input type="text" value={link} onChange={handleLinkChange} />
      </label>
      <br />
      <button className="btn" type="submit" onClick={handleLinkSubmit}>
        Shorten Link
      </button>
      <label className="link-info">
        Your link is:
        <a href={shortLink}>{shortLink}Ceck</a>
      </label>
    </div>
  );
};

export default LinkForm;
