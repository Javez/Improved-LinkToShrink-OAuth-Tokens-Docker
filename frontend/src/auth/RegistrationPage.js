import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useHistory } from "react-router-dom";
import isGoogleTokenValid from "../api/googleTokenCheck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const _google_cliend_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const _host = process.env.REACT_APP_BACKEND_HOST;
const _port = process.env.REACT_APP_BACKEND_PORT;

const RegisterPage = ({ ClientId }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegistration = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    try {
      const response = await fetch(`http://${_host}:${_port}/register/user`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        response.ok
          ? console.log("All data sended")
          : console.log("some problem at sending data");
        history.push("/login", {
          success: "Registration successful. Please log in.",
        });
      }
    } catch (error) {
      console.error(
        "A network error occurred when trying to fetch resource:",
        error
      );
    }
  };

 const onSuccessGoogleLogin = async (event) => {
   event.preventDefault();
   ///TEST
   console.log("res:", event);
   console.log("res.tokenId:", event.tokenId);
   console.log(
     "res.getAuthResponse().id_token",
     event.getAuthResponse().id_token
   );
   console.log("Login Success: currentUser:", event.profileObj);
   console.log("token:", event.tokenObj);

   try {
     const id_token = event.tokenId;
     const result = await isGoogleTokenValid(id_token);
     if (!result) {
       setError("Google token is not valid");
     } else {
       console.log(
         `Logged in successfully welcome ${event.profileObj.name} 😍. \n See console for full profile object.`
       );
       const decodedToken = JSON.parse(atob(id_token.split(".")[1]));
       const newEmail = decodedToken.email;
       const newName = decodedToken.name;
       const newPicture = decodedToken.picture;
       ///TEST
       console.log("Test user data from token: ", newName, newEmail, newPicture);
       const formData = new FormData();
       formData.append("username", newName);
       formData.append("email", newEmail);
       ///TEST
       console.log("Test formData: ", formData);
       const response = await fetch(
         `http://${_host}:${_port}/auth/googleuser`,
         {
           method: "POST",
           credentials: "include",
           body: formData,
         }
       );
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       } else {
         response.ok
           ? console.log("All data sended")
           : console.log("some problem at sending data");
         history.push("/", {
           success: "Registration successful. Please log in.",
         });
       }
     }
   } catch (error) {
     console.error(
       "A network error occurred when trying to fetch resource:",
       error
     );
   }
 };

 const onFailureGoogleLogin = async (response) => {
    if (response.error === "idpiframe_initialization_failed") {
      console.error("Google API initialization failed:", response.details);
      setError(response.details)
    } else {
      // Handle other types of errors
      console.error("Google Login failed:", response);
    }
 };
  /// TODO: check all console.log funct and delete it, in backend and frontend

  return (
    <div className="main-container">
      <header className="header-container">
        <h1>Sign Up</h1>
      </header>
      <div className="main-block">
        <section className="section-auth-form">
          {error && (
            <div className="error-block">
              <p className="error">{error}</p>
            </div>
          )}
          <form
            onSubmit={handleRegistration}
            className="form-container form-container-auth"
          >
            <h3>Please enter your data</h3>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="text"
                value={username}
                id="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label
                htmlFor="username"
                className="form-container-input_group__label"
              >
                Username
              </label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="email"
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="form-container-input_group__label"
              >
                Email
              </label>
            </div>
            <div className="form-container-input_group">
              <input
                className="form-container-input_group__input"
                placeholder="https://example.com"
                type="password"
                value={password}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="form-container-input_group__label"
              >
                Password
              </label>
            </div>
            <button type="submit" className="btn btn-slim">
              Confirm
            </button>
            <Link to="/login">
              <p className="redirect-link">Already have account? Sing In</p>
            </Link>
          </form>
          <br />
          <form className="form-container form-auth-container-btn">
            <GoogleOAuthProvider clientId={_google_cliend_id}>
              <GoogleLogin
                render={(renderProps) => (
                  <button
                    type="button"
                    className="btn btn-slim"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="google-icon" />
                    Sign in with google
                  </button>
                )}
                onSuccess={onSuccessGoogleLogin}
                onFailure={onFailureGoogleLogin}
                cookiePolicy="single_host_origin"
              />
            </GoogleOAuthProvider>
          </form>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
