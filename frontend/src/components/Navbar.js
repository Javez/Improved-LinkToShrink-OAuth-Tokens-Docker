import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <Link to="/">
        <img src="logo.png" alt="Logo" />
      </Link>
      <div>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/signin">
          <button>Sign In</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
