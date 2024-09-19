import React, { useState } from "react";
import "./SideBar.css";
import Logo from "../../assets/logo.svg";

function SideBar() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleActive =(index)=>{
    setActiveIndex(index);
  }

  return (
    <aside className="sidebar">
      <div className="logo-cont">
        <img src={Logo} alt="logo" />
      </div>
      <div className="page-navigator">
        <ul>
          <li
            className={activeIndex === 0 ? "active" : ""}
            onClick={() => handleActive(0)}
          >
            <span>
              <i className="fa-solid fa-house"></i>
              <p>Dashboard</p>
            </span>
          </li>
          <li
            className={activeIndex === 1 ? "active" : ""}
            onClick={() => handleActive(1)}
          >
            <span>
              <i className="fa-solid fa-dollar-sign"></i>
              <p>Sales</p>
            </span>
          </li>
          <li
            className={activeIndex === 2 ? "active" : ""}
            onClick={() => handleActive(2)}
          >
            <span>
              <i className="fa-solid fa-store"></i>
              <p>Inventory</p>
            </span>
            <i className="fa-solid fa-greater-than"></i>
          </li>
          <li
            className={activeIndex === 3 ? "active" : ""}
            onClick={() => handleActive(3)}
          >
            <span>
              <i className="fa-solid fa-tag"></i>
              <p>Purchase</p>
            </span>
          </li>
          <li
            className={activeIndex === 4 ? "active" : ""}
            onClick={() => handleActive(4)}
          >
            <span>
              <i className="fa-solid fa-file"></i>
              <p>Reports</p>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
