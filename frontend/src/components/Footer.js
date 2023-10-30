import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="footer-container">
      <Link to="/">
        <img src="logo.png" alt="Logo" />
        <a href="/">Link to Shrink</a>
      </Link>
      <div>
        <a>@ Copyright</a>
        <a>Company</a>
        <a>Products</a>
      </div>
    </div>
  );
};

export default NavBar;
