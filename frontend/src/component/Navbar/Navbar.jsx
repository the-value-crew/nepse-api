// Navbar.js
import React from "react";
import "./navbar.css";
import logo from "../../assets/navbar/newlogo.png";

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">
          <img className="logo-image" src={logo} alt="Logo" />
        </div>
        <div className="search-bar">
          <input type="text" placeholder="Search" />
          <button>Search</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
