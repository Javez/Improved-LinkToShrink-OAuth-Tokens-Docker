import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
const LinkForm = (props) => {
  const [link, setLink] = useState("");
  const [shortLink, setShortLink] = useState("");
  const inputRef = useRef();

  const handleLinkChange = (e) => {
    setLink(e.target.value);
  };

  const handleTakeShortLink = (e) => {
    setShortLink(e.target.value);
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
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

  const handleCopy = () => {
    navigator.clipboard.writeText(inputRef.current.value);
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
          https://example.com
        </label>
      </div>
      <br />
      <button className="btn" type="submit" onClick={handleLinkSubmit}>
        Reduce My Link
      </button>
      <h1>Here you will see a short link</h1>
      <div className="form-container-info_group">
        <input
          ref={inputRef}
          type="text"
          value={shortLink}
          className="form-container-info_group__input"
          placeholder="https://example.com"
        />
        <FontAwesomeIcon
          icon={faCopy}
          className="form-container-info_group__copy"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
};

export default LinkForm;
