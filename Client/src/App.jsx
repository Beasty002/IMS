import React from "react";
import { useState } from "react";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
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
import MulVarList from "./pages/BrandItemList/MulVarList";
import SinVarList from "./pages/BrandItemList/SinVarList";
import PurchaseEntry from "./pages/PurchaseEntry/PurchaseEntry";
import { ToastContainer, toast } from "react-toastify";
import BrandReport from "./pages/BrandReport/BrandReport";
import FinalReport from "./pages/FinalReport/FinalReport";
import Preview from "./pages/Preview/Preview";

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

  const CatBrandPage = () => {
    const { categoryName, brandName, multi } = useParams();

    if (multi === "true") {
      return <MulVarList />;
    } else {
      return <SinVarList />;
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
      <div className="navigation-elem">
        <SideBar
          currentPage={getCurrentPageTitle()}
          sideClass={isSidebarOpen ? "sidebar-active" : ""}
        />
        <div className="left-component">
          <NavBar
            currentPage={getCurrentPageTitle()}
            onMenuClick={toggleSidebar}
          />
          <main className="page-changer">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/purchases" element={<Purchase />} />
              <Route path="/cateogry" element={<Category />} />
              <Route path="/report" element={<Report />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/salesEntry" element={<SaleEntry />} />
              <Route path="/purchasesEntry" element={<PurchaseEntry />} />
              <Route path="/previewReport" element={<Preview />} />
              <Route
                path="/catband/:categoryName/:brandName/:multi"
                element={<CatBrandPage />}
              />
              <Route path="/catband/:categoryName" element={<CatBrandList />} />
              <Route
                path="/catReport/:categoryName"
                element={<BrandReport />}
              />
              <Route
                path="/finalReport/:parentCategory/:brandId/:multiVar"
                element={<FinalReport />}
              />
            </Routes>
            <ToastContainer />
          </main>
        </div>
      </div>
    </>
  );
}
