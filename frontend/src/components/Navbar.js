import React from "react";
import { Link } from "react-router-dom";
import userIcon from "../img/User-icon.png";
const NavBar = (props) => {
  const username = props.username ? props.username : "Anonymous"; 

  return (
    <div className="navbar-container">
      <Link to="/" className="navbar-container-logo">
        <img src="logo.png" alt="Logo" className="left-img" />
        <a href="/">Link to Shrink</a>
      </Link>
      <ul className="navbar-container-links">
        <li className="btn">Support</li>
        <li className="btn">Other Products</li>
        <li className="btn">About</li>
      </ul>
      <div className="navbar-container-user">
        <div className="navbar-container-user-field">
          <div className="navbar-container-user-field_links">
            <Link
              to="register"
              className="navbar-container-user-field_links__button"
            >
              SignUp
            </Link>
            <Link
              to="login"
              className="navbar-container-user-field_links__button"
            >
              SignIn
            </Link>
          </div>
          <div className="navbar-container-user-field_info">
            <span>{username}</span>
          </div>
        </div>
        <div className="navbar-container-user-icon">
          <img src={userIcon} alt="User Icon" className="right-img" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
