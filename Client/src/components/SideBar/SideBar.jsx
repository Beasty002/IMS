import React, { useState } from "react";
import "./SideBar.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import DelPop from "../../popups/DelPop/DelPop";

function SideBar({currentPage}) {

  const [activeIndex, setActiveIndex] = useState({currentPage});
  const [expand, setExpand] = useState(false);
  const [isCatModel, setIsCatModel] = useState(false);

  const handleActive = (index) => {
    setActiveIndex(index);
    
  };

  const handleExpand = () => {
    setExpand(!expand);
  };

  const setCatModel = () => {
    setIsCatModel(true);
  };
  const closeCatModel = () => {
    setIsCatModel(false);
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
              className={activeIndex === 'Dashboard' ? "active" : ""}
              onClick={() => handleActive('Dashboard')}
            >
              <span>
                <i className="fa-solid fa-house"></i>
                <p>Dashboard</p>
              </span>
            </li>
          </Link>
          <Link to="/sales">
            <li
              className={activeIndex === 'Sales' ? "active" : ""}
              onClick={() => handleActive('Sales')}
            >
              <span>
                <i className="fa-solid fa-dollar-sign"></i>
                <p>Sales</p>
              </span>
            </li>
          </Link>
          <Link to={`${currentPage.toLowerCase()}`}>
            <li
              className={activeIndex === 'Inventory' ? "active" : ""}
              onClick={() => handleActive('Inventory')}
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
                  <li onClick={setCatModel}> + Add category</li>
                </ul>
              </>
            ) : (
              <></>
            )}
          </Link>
          <Link to="/purchases">
            <li
              className={activeIndex === 'Purchase' ? "active" : ""}
              onClick={() => handleActive('Purchase')}
            >
              <span>
                <i className="fa-solid fa-tag"></i>
                <p>Purchase</p>
              </span>
            </li>
          </Link>
          <Link to="/report">
            <li
              className={activeIndex === 'Reports' ? "active" : ""}
              onClick={() => handleActive('Reports')}
            >
              <span>
                <i className="fa-solid fa-file"></i>
                <p>Reports</p>
              </span>
            </li>
          </Link>
        </ul>
      </div>
      <DelPop isOpen={isCatModel} onClose={closeCatModel} />
    </aside>
  );
}

export default SideBar;
