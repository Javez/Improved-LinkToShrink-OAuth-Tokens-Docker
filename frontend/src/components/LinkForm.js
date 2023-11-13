import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
const LinkForm = (props) => {
  const [link, setLink] = useState("");
  const [shortLink, setShortLink] = useState("");
  const inputRef = useRef();

  const handleLinkSubmit = (event) => {
    event.preventDefault();
    const data = new URLSearchParams();
    data.append("url", link);
    console.log(data);
    fetch(`http://${props._host}:${props._port}/shrinkUrl`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      credentials: "include",
      body: data,
    })
      .then((res) => res.text())
      .then((text) => {
       setShortLink(text);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputRef.current.value);
  };

  return (
    <div className="form-container form-container-link">
      <h1>Insert a link to reduce</h1>
      <form className="form-container-input_group" onSubmit={handleLinkSubmit}>
        <input
          id="link"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="form-container-input_group__input"
          placeholder="https://example.com"
        />
        <label htmlFor="link" className="form-container-input_group__label">
          https://example.com
        </label>
        <br />
        <button className="btn" type="submit">
          Reduce My Link
        </button>
      </form>
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
          className="copy-icon"
          onClick={handleCopy}
        />
      </div>
    </div>
  );
};

export default LinkForm;
