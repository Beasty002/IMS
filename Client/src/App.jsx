import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import "./App.css";
import Dashboard from "./pages/Dashboard/Dashboard";
import Inventory from "./pages/Inventory/Inventory";
import Purchase from "./pages/Purchase/Purchase";
import Sales from "./pages/Sales/Sales";
import Report from "./pages/Report/Report";
import DelPoppp from "./components/DelPop/DelPoppp";

export default function App() {
  return (
    <>
      <div className="navigation-elem">
        <SideBar />
        <div className="left-component">
          <NavBar />
          <main className="page-changer">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/purchases" element={<Purchase />} />
              <Route path="/report" element={<Report />} />
              <Route path="/sales" element={<Sales />} />
            </Routes>
          </main>
        </div>
      </div>
      <DelPoppp />
    </>
  );
}
