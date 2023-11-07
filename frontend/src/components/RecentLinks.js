
import React, { useState, useEffect } from "react";

const RecentLinks = () => {
  const [links, setLinks] = useState([]);

  // Retrieve the links from sessionStorage when the component mounts
  useEffect(() => {
    const storedLinks = JSON.parse(sessionStorage.getItem("recentLinks"));
    if (storedLinks) {
      setLinks(storedLinks);
    }
  }, []);

  // Function to add a new link
  const addLink = (newLink) => {
    setLinks((prevLinks) => {
      let updatedLinks = [...prevLinks, newLink];
      if (updatedLinks.length > 10) {
        // Remove the oldest link if the list has more than 10 links
        updatedLinks = updatedLinks.slice(1);
      }
      // Update the links in sessionStorage
      sessionStorage.setItem("recentLinks", JSON.stringify(updatedLinks));
      return updatedLinks;
    });
  };

  return (
    <div className="recent-links-container">
      <h2>Recent links</h2>
      <ol className="recent-links-ordered-list">
        {links.map((link, index) => (
          <li key={index}>{link}</li>
        ))}
      </ol>
    </div>
  );
};

export default RecentLinks;
