import React from "react";
import "./NavBar.css";

function NavBar({ currentPage, onMenuClick }) {

  if (currentPage === '/') {
    currentPage = 'Dashboard';
  }


  return (
    <nav className="page-head">
      <div className="left-crumb">
        <span className="nav-bread-crumb">
          <p className="category">Plyhouse</p>
          <i class='bx bx-chevron-right' ></i>
          <p className="pages">{currentPage}</p>
        </span>
      </div>
      <div className="right-interact">
        <i className="fa-regular fa-bell" aria-label="Notifications"></i>
        <span className="nav-border-line"></span>
        <i class="fa-solid fa-bars menu-icon" onClick={onMenuClick}></i>

      </div>
    </nav>
  );
}

export default NavBar;
