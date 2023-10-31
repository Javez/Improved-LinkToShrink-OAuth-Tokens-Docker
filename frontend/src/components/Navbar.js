import React from "react";
import { Link } from "react-router-dom";
import userIcon from "../img/User-icon.png";
const NavBar = (props) => {
  const username = props.username ? props.username : "Anonymous"; 


  return (
    <div className="navbar-container">
      <Link to="/" className="navbar-logo">
        <img src="logo.png" alt="Logo" className="left-img"/>
        <a href="/">Link to Shrink</a>
      </Link>
      <ul className="navbar-links">
        <li className="btn-dark">Support</li>
        <li className="btn-dark">Other Products</li>
        <li className="btn-dark">About</li>
      </ul>
      <div className="navbar-user">
        <div className="navbar-user-container">
          <Link to="/signup" className="navbar-user-link">
            <button>SignUp</button>
          </Link>
          <Link to="/signin" className="navbar-user-link">
            <button>SignIn</button>
          </Link>
          <div className="navbar-user-info">
            <span>{username}</span>
          </div>
        </div>
        <div className="navbar-user-icon">
          <img src={userIcon} alt="User Icon" className="right-img"/>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
