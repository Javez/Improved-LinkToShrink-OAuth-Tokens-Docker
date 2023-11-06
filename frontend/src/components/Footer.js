import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="footer-container">
      <Link to="/" className="footer-logo">
        <img src="logo.png" alt="Logo" />
        <a href="/">Link to Shrink</a>
      </Link>
      <div className="footer-links">
        <li className="btn">Company</li>
        <li className="btn">Privacy</li>
      </div>
      <p className="footer-copyright">© 2023 Danylov O.G. | All Rights Reserverd</p>
    </div>
  );
};

export default NavBar;
