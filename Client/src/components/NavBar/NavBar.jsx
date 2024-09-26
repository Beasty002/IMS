import React from "react";
import "./NavBar.css";

function NavBar({ currentPage }) {

  if (currentPage === '/') {
    currentPage = 'Dashboard';
  }


  return (
    <nav className="page-head">
      <div className="left-crumb">
        <span>
          <p className="category">Plyhouse</p>
          <i class='bx bx-chevron-right' ></i>
          <p className="pages">{currentPage}</p>
        </span>
      </div>
      <div className="right-interact">
        <i className="fa-regular fa-bell" aria-label="Notifications"></i>
        <span className="nav-border-line"></span>

      </div>
    </nav>
  );
}

export default NavBar;
