import React, { useState, useEffect } from "react";
import "./Report.css";
import { useAuth } from "../../customHooks/useAuth";
import { useNavigate } from "react-router-dom";
import ReportPrint from "../../popups/ReportPrint/ReportPrint";

function Report() {
  const { fetchCategory, categories, catStock } = useAuth();
  const [enablePortal, setEnablePortal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(catStock || {});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    getCategoryStock();
  }, []);

  useEffect(() => {
    if (categories) {
      console.log(categories);
    }
  }, [categories]);

  useEffect(() => {
    const filtered = Object.entries(catStock)
      .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    setFilteredCategories(filtered);
  }, [searchQuery, catStock]);

  const handleReportNavigation = (categoryName) => {
    navigate(`/catReport/${categoryName}`);
  };

  const getCategoryStock = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategoryReport = async () => {
    console.log(JSON.stringify({ catStock }));
    try {
      const response = await fetch("http://localhost:3000/api/fetchCat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catStock }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section>
        <h1>Reports</h1>
        <div className="cat-list-top">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search input"
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <div className="left-sale">
              <input type="date" />
            </div>
            <button onClick={fetchCategoryReport} className="primary-btn">
              Save
            </button>
            <div
              onClick={() => setEnablePortal(!enablePortal)}
              className="btn-container"
            >
              <button className="primary-btn">
                <i class="bx bxs-printer"></i> Print
              </button>
            </div>
          </div>
        </div>
        <div className="cat-list">
          {Object.entries(filteredCategories).map(([key, value], index) => (
            <div
              onClick={() => handleReportNavigation(key)}
              key={index}
              className="cat-box"
            >
              <h3>{key}</h3>
              <p className="cat-stock-availability">
                Stock available : {value}
              </p>
              <div className="action-container">
                <i class="bx bx-printer print-icon"></i>
              </div>
            </div>
          ))}
        </div>
        <ReportPrint
          isOpen={enablePortal}
          onClose={() => setEnablePortal(!enablePortal)}
          data={categories}
        />
      </section>
      {isLoading ? (
        <div className="center-hanne">
          <div className="bhitri-center">
            <div className="box"></div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Report;
