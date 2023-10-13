import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const [user, setUser] = useState({ name: "John Doe", icon: "user.png" });

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
        <div>
          <img src={user.icon} alt="User Icon" />
          <span>{user.name}</span>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
