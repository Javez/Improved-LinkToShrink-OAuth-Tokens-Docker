import React from "react";
import { Link } from "react-router-dom";
import logo from '../img/Logo.png';
const NavBar = () => {
  return (
    <div className="footer-container">
      <Link to="/" className="footer-logo">
        <img src={logo} alt="Logo" />
        <p>Link to Shrink</p>
      </Link>
      <div className="footer-links">
        <li className="btn">Company</li>
        <li className="btn">Privacy</li>
      </div>
      <p className="footer-copyright">© 2023-2024 Danylov O.G. | All Rights Reserverd</p>
    </div>
  );
};

export default NavBar;
