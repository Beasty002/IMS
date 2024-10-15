import React, { useState, useEffect } from "react";
import "./Report.css";
import { useAuth } from "../../customHooks/useAuth";
import { Link } from "react-router-dom";
import ReportPrint from "../../popups/ReportPrint/ReportPrint";

function Report() {
  const { fetchCategory, categories } = useAuth();
  const [enablePortal, setEnablePortal] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    getCategoryStock();
  }, []);

  const getCategoryStock = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getCatStock", {
        method: "POST",
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (categories) {
      console.log(categories);
    }
  }, [categories]);

  return (
    <section>
      <h1>Categories</h1>
      <div className="cat-list-top">
        <div className="search-box">
          <i className="bx bx-search-alt"></i>
          <input
            type="text"
            placeholder="Search categories..."
            aria-label="Search input"
          />
        </div>
        <div
          onClick={() => setEnablePortal(!enablePortal)}
          className="btn-container"
        >
          <button className="primary-btn">
            <i class="bx bxs-printer"></i> Print
          </button>
        </div>
      </div>
      <div className="cat-list">
        {categories?.map((item) => (
          <div key={item._id} className="cat-box">
            <h3>{item.title}</h3>
            <p className="cat-stock-availability">Stock available : 80</p>
            <div className="action-container">
              <i class="bx bx-printer print-icon"></i>
            </div>
          </div>
        ))}
      </div>
      <ReportPrint
        isOpen={enablePortal}
        onClose={() => setEnablePortal(!enablePortal)}
      />
    </section>
  );
}

export default Report;
