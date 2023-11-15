import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import LinkForm from "./LinkForm";
import RecentLinks from "./RecentLinks";

const _host = process.env.REACT_APP_BACKEND_HOST;
const _port = process.env.REACT_APP_BACKEND_PORT;

const MainPage = () => {
  const history = useHistory();

  const [urlArray, setUrlArray] = useState([]);
  const [shortUrlArray, setShortUrlArray] = useState([]);

  const handleLinkFormData = (newUrl, newShortUrl) => {
    setUrlArray((oldArray) => {
      if (!oldArray.includes(newUrl)) {
        if (oldArray.length >= 10) {
          oldArray.pop();
        }
        return [newUrl, ...oldArray];
      }
      return oldArray;
    });

    setShortUrlArray((oldArray) => {
      if (!oldArray.includes(newShortUrl)) {
        if (oldArray.length >= 10) {
          oldArray.pop();
        }
        return [newShortUrl, ...oldArray];
      }
      return oldArray;
    });
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    if (!token && !username) {
      history.push("/login");
    }
  }, [history]);

  return (
    <div className="main-container">
      <nav className="nav-block">
        <NavBar
          username={sessionStorage.getItem("username")}
          picUrl={sessionStorage.getItem("picUrl")}
        />
      </nav>
      <header className="header-container">
        <h1>Main page</h1>
      </header>
      <main className="main-block">
        <section className="section-form">
          <LinkForm
            _host={_host}
            _port={_port}
            handleLinkFormData={handleLinkFormData}
            history={history}
          />
        </section>
        <section className="section-recent-links">
          <RecentLinks urlArray={urlArray} shortUrlArray={shortUrlArray} />
        </section>
      </main>
      <footer className="footer-blockr">
        <Footer />
      </footer>
    </div>
  );
};

export default MainPage;
