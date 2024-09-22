import React, { useState } from "react";
import "./SideBar.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

function SideBar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expand, setExpand] = useState(false);

  const handleActive = (index) => {
    setActiveIndex(index);
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  return (
    <aside className="sidebar">
      <div className="logo-cont">
        <img src={Logo} alt="logo" />
      </div>
      <div className="page-navigator">
        <ul>
          <Link to="/">
            <li
              className={activeIndex === 0 ? "active" : ""}
              onClick={() => handleActive(0)}
            >
              <span>
                <i className="fa-solid fa-house"></i>
                <p>Dashboard</p>
              </span>
            </li>
          </Link>
          <Link to="/sales">
            <li
              className={activeIndex === 1 ? "active" : ""}
              onClick={() => handleActive(1)}
            >
              <span>
                <i className="fa-solid fa-dollar-sign"></i>
                <p>Sales</p>
              </span>
            </li>
          </Link>
          <Link to="/inventory">
            <li
              className={activeIndex === 2 ? "active" : ""}
              onClick={() => handleActive(2)}
            >
              <span onClick={handleExpand}>
                <i className="fa-solid fa-store"></i>
                <p>Inventory</p>
              </span>
              <i
                className={`fa-solid fa-greater-than ${
                  expand ? "rotate" : "passive"
                } `}
              ></i>
            </li>
            {expand ? (
              <>
                <ul className="hidden-cate">
                  <li> Plywood</li>
                  <li> Liner</li>
                  <li> Doors</li>
                  <li> Laminates</li>
                  <li> + Add category</li>
                </ul>
              </>
            ) : (
              <></>
            )}
          </Link>
          <Link to="/purchases">
            <li
              className={activeIndex === 3 ? "active" : ""}
              onClick={() => handleActive(3)}
            >
              <span>
                <i className="fa-solid fa-tag"></i>
                <p>Purchase</p>
              </span>
            </li>
          </Link>
          <Link to="/report">
            <li
              className={activeIndex === 4 ? "active" : ""}
              onClick={() => handleActive(4)}
            >
              <span>
                <i className="fa-solid fa-file"></i>
                <p>Reports</p>
              </span>
            </li>
          </Link>
        </ul>
      </div>
    </aside>
  );
}

export default SideBar;
