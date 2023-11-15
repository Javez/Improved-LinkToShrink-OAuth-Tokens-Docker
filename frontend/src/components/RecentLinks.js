import React from "react";

const RecentLinks = ({ urlArray, shortUrlArray }) => {

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="recent-links-container">
      <h2>Recent links</h2>
      <ol className="recent-links-ordered-list">
        {urlArray.map((url, index) => (
          <li className="recent-links-ordered-list__item" key={index}>
            <div className="recent-links-ordered-list__item__group">
              <div className="recent-links-ordered-list__item__group__span">
                <span> Original Link </span>
                <br />
                <span> Short Link </span>
              </div>
              <div className="recent-links-ordered-list__item__group__urls">
                <input value={url}></input>
                <br />
                <input value={shortUrlArray[index]}></input>
              </div>
            </div>

            <div className="recent-links-ordered-list__item__copy">
              <button
                className="btn btn-copy"
                onClick={() => handleCopy(shortUrlArray[index])}
              >
                Copy
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecentLinks;
