import React from "react";
import { Link, useHistory } from "react-router-dom";
import userIcon from "../img/User-icon.png";
import logo from '../img/Logo.png';
const NavBar = (props) => {
  const history = useHistory();

  let userAvatar;
  const username = props.username ? props.username : "Anonymous";
  
  if (props.picUrl) {
    userAvatar = props.picUrl;
  } else {
    userAvatar = userIcon;
  }

  function handleLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");

    history.push("/login");
  }

  return (
    <div className="navbar-container">
      <Link to="/" className="navbar-container-logo">
        <img src={logo} alt="Logo" className="left-img" />
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
              onClick={handleLogout}
              className="navbar-container-user-field_links__button"
            >
              Log Out
            </Link>
          </div>
          <div className="navbar-container-user-field_info">
            <span>{username}</span>
          </div>
        </div>
        <div className="navbar-container-user-icon">
          <img
            src={userAvatar}
            alt="User Icon"
            className="right-img"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
