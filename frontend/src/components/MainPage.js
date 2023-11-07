import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import NavBar from "../components/Navbar";
import Footer from "../components/Footer";
import LinkForm from "./LinkForm";
import RecentLinks from "./RecentLinks";

const _host = process.env.BACKEND_HOST;
const _port = process.env.BACKEND_PORT;

const MainPage = () => {
  const history = useHistory();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      history.push("/login");
    }
  }, [history]);


  return (
    <div className="main-container">
      <nav className="nav-block">
        <NavBar />
      </nav>
      <header className="header-container">
        <h1>Main page</h1>
      </header>
      <main className="main-block">
        <section className="section-form">
          <LinkForm _host={_host} _port={_port} />
        </section>
        <section className="section-recent-links">
          <RecentLinks />
        </section>
      </main>
      <footer className="footer-blockr">
        <Footer />
      </footer>
    </div>
  );
};

export default MainPage;
