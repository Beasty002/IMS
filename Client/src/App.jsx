import React from "react";
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Purchase from "./pages/Purchase/Purchase";
import Report from "./pages/Report/Report";
import SalesPage from "./pages/SalesPage/SalesPage";
import Category from "./pages/CategoryLayout/Category";
import CatBrandList from "./pages/CatBrandList/CatBrandList";
import SaleEntry from "./popups/SaleEntry/SaleEntry";

export default function App() {
  const location = useLocation();
  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "/";
      case "/inventory":
        return "Inventory";
      case "/purchases":
        return "Purchases";
      case "/report":
        return "Report";
      case "/sales":
        return "Sales";
      default:
        return "/";
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="navigation-elem">
        <SideBar currentPage={getCurrentPageTitle()} sideClass={isSidebarOpen ? "sidebar-active" : ""} />
        <div className="left-component">
          <NavBar currentPage={getCurrentPageTitle()} onMenuClick={toggleSidebar} />
          <main className="page-changer">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/purchases" element={<Purchase />} />
              <Route path="/cateogry" element={<Category />} />
              <Route path="/report" element={<Report />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/saleEntry" element={<SaleEntry />} />
              <Route path="/catband/:categoryName" element={<CatBrandList />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
