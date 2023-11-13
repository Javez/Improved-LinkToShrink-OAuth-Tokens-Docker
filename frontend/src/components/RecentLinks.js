
import React, { useState, useEffect } from "react";

const RecentLinks = () => {
   const [links, setLinks] = useState([]);
   const [shortLinks, setShortLinks] = useState([]);

  useEffect(() => {
    const storedLinks = JSON.parse(sessionStorage.getItem("links"));
    const storedShortLinks = JSON.parse(sessionStorage.getItem("shortLinks"));
   
    if (storedLinks) {
      setLinks(storedLinks);
    }

    if (storedShortLinks) {
      setShortLinks(storedShortLinks);
    }
  }, []);

  return (
    <div className="recent-links-container">
      <h2>Recent links</h2>
      <ol className="recent-links-ordered-list">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
            <span> - Short Link: </span>
            <a
              href={shortLinks[index]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortLinks[index]}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecentLinks;
