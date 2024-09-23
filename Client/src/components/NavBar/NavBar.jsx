import React from "react";
import "./NavBar.css";

function NavBar({ currentPage }) {


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
        <span className="border-line"></span>
        <div className="search-box">
          <i className='bx bx-search-alt'></i>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search input"
          />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
