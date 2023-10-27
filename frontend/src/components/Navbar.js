import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {

  return (
    <nav>
      <Link to="/">
        <img src="logo.png" alt="Logo" />
        <a href="/">Link to Shrink</a>
      </Link>
      <div>
        <ul>
          <li>Support</li>
          <li>Other Products</li>
          <li>About</li>
        </ul>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
        <div>
          <img alt="User Icon" />
          <span>John Doe</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
