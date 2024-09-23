import React, { useState, useEffect } from "react";
import "./SideBar.css";
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import AddCat from "../../popups/AddCat/AddCat";

function SideBar({ currentPage }) {
  const [activeIndex, setActiveIndex] = useState({ currentPage });
  const [expand, setExpand] = useState(false);
  const [isCatModel, setIsCatModel] = useState(false);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/category", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          console.log("Error while fetching data");
          return;
        }
        setCategories(data.cats);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategory();
  }, []);

  // still facing issue space for new cate is seen but not inserted
  const addCategory = (newCategory) => {
    setCategories((prevState) => [...prevState, newCategory]);
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
              className={activeIndex === "Dashboard" ? "active" : ""}
              onClick={() => handleActive("Dashboard")}
            >
              <span>
                <i className="fa-solid fa-house"></i>
                <p>Dashboard</p>
              </span>
            </li>
          </Link>
          <Link to="/sales">
            <li
              className={activeIndex === "Sales" ? "active" : ""}
              onClick={() => handleActive("Sales")}
            >
              <span>
                <i className="fa-solid fa-dollar-sign"></i>
                <p>Sales</p>
              </span>
            </li>
          </Link>
          <Link to={`${currentPage.toLowerCase()}`}>
            <li
              className={activeIndex === "Inventory" ? "active" : ""}
              onClick={() => handleActive("Inventory")}
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
                  {categories?.map((item) => (
                    <li key={item._id}>{item.title}</li>
                  ))}
                  <li onClick={setCatModel}> + Add category</li>
                </ul>
              </>
            ) : (
              <></>
            )}
          </Link>
          <Link to="/purchases">
            <li
              className={activeIndex === "Purchase" ? "active" : ""}
              onClick={() => handleActive("Purchase")}
            >
              <span>
                <i className="fa-solid fa-tag"></i>
                <p>Purchase</p>
              </span>
            </li>
          </Link>
          <Link to="/report">
            <li
              className={activeIndex === "Reports" ? "active" : ""}
              onClick={() => handleActive("Reports")}
            >
              <span>
                <i className="fa-solid fa-file"></i>
                <p>Reports</p>
              </span>
            </li>
          </Link>
        </ul>
      </div>
      <AddCat
        isOpen={isCatModel}
        onClose={closeCatModel}
        addCategory={addCategory}
      />
    </aside>
  );
}

export default SideBar;
