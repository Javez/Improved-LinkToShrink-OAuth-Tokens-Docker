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
    <div className="form-container">
      <h1>Insert a link to reduce</h1>
      <div className="form-container-input_group">
        <input
          type="text"
          value={link}
          onChange={handleLinkChange}
          className="form-container-input_group__input"
          placeholder="https://example.com"
        />
        <label for="name" className="form-container-input_group__label">
          My-long-link.com
        </label>
      </div>
      <br />
      <button className="btn" type="submit" onClick={handleLinkSubmit}>
        Reduce My Link
      </button>
      <h1>Here you will see a short link</h1>
      <label className="form-container-info_group">
        <a type="text" href={link} value={link} />
        No links
        <a />
      </label>
    </div>
  );
};

export default LinkForm;
