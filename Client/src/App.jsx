import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import NavBar from "./components/NavBar/NavBar";
import './App.css'

export default function App() {
  return (
    <>
      <div className="navigation-elem">
        <SideBar />
        <NavBar />
      </div>
      <Routes></Routes>
    </>
  );
}
