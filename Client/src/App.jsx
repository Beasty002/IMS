import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Inventory from "./pages/Inventory/Inventory";
import Purchase from "./pages/Purchase/Purchase";
import Report from "./pages/Report/Report";
import SalesPage from "./pages/SalesPage/SalesPage";

export default function App() {
  const location = useLocation();
  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/inventory":
        return "Inventory";
      case "/purchases":
        return "Purchases";
      case "/report":
        return "Report";
      case "/sales":
        return "Sales";
      default:
        return "Dashboard";
    }
  };
  return (
    <>
      <div className="navigation-elem">
        <SideBar currentPage={getCurrentPageTitle()} />
        <div className="left-component">
          <NavBar currentPage={getCurrentPageTitle()} />
          <main className="page-changer">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/purchases" element={<Purchase />} />
              <Route path="/report" element={<Report />} />
              <Route path="/sales" element={<SalesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
