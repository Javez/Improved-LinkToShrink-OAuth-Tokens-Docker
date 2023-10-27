import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <footer>
      <Link to="/">
        <img src="logo.png" alt="Logo" />
        <a href="/">Link to Shrink</a>
      </Link>
      <div>
        <a>@ Copyright</a>
        <a>Company</a>
        <a>Products</a>
      </div>
    </footer>
  );
};

export default NavBar;
