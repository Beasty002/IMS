import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./NavBar.css";

function NavBar({ currentPage, onMenuClick }) {
  if (currentPage === "/") {
    currentPage = "Dashboard";
  }

  const [lowStock, setLowStock] = useState([]);
  const [showNotifi, setShowNotifi] = useState(false);

  const { categoryName, brandName } = useParams();

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/checkStock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setLowStock(data.lowStock);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (lowStock) {
      console.log("Navbar ko yo", lowStock);
    }
  }, [lowStock]);

  return (
    <nav className="page-head">
      <div className="left-crumb">
        <span className="nav-bread-crumb">
          <p className="category">Plyhouse</p>
          <i class="bx bx-chevron-right"></i>
          <p className="pages">{currentPage}</p>
        </span>
      </div>
      <div className="right-interact">
        <div className="notification-shade">
          <i
            onClick={() => setShowNotifi(!showNotifi)}
            className="fa-regular fa-bell"
            aria-label="Notifications"
          ></i>
          {showNotifi ? (
            <div id="notifications">
              <section id="notiContainer">
                {lowStock?.map((item, index) => (
                  <div key={index + 1} class="noti-box">
                    <i class="bx bxs-circle"></i>
                    <p class="noti-msg">
                      {item.stock} stock left of {item.brandCategory}
                    </p>
                  </div>
                ))}
              </section>
            </div>
          ) : (
            <></>
          )}
        </div>
        <span className="nav-border-line"></span>
        <i class="fa-solid fa-bars menu-icon" onClick={onMenuClick}></i>
      </div>
    </nav>
  );
}

export default NavBar;
