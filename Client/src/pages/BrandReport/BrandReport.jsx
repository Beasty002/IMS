import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import ReportPrint from "../../popups/ReportPrint/ReportPrint";

function BrandReport() {
  const { categoryName } = useParams();
  const { fetchBrandData, fetchBrand, stockData } = useAuth();
  const [enablePortal, setEnablePortal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, []);

  useEffect(() => {
    setFilteredBrands(fetchBrand);
  }, [fetchBrand]);

  useEffect(() => {
    if (fetchBrand) {
      const filtered = fetchBrand.filter((item) =>
        item.brandName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBrands(filtered);
    }
  }, [searchTerm, fetchBrand]);

  return (
    <>
      <section>
        <h1>Reports</h1>
        <div className="cat-list-top">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search brands..."
              aria-label="Search input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div
            onClick={() => setEnablePortal(!enablePortal)}
            className="btn-container"
          >
            <button className="primary-btn">
              <i className="bx bxs-printer"></i> Print
            </button>
          </div>
        </div>
        {!filteredBrands || filteredBrands.length < 1 ? (
          <h1
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            No brand related to this category
          </h1>
        ) : (
          <div className="cat-list">
            {filteredBrands.map((item, index) => (
              <div key={item._id} className="cat-box">
                <h3>{item.brandName}</h3>
                <p className="cat-stock-availability">
                  Stock available : {stockData[item.brandName]}
                </p>
                <div className="action-container">
                  <i className="bx bx-printer print-icon"></i>
                </div>
              </div>
            ))}
          </div>
        )}
        <ReportPrint
          isOpen={enablePortal}
          onClose={() => setEnablePortal(!enablePortal)}
          data={fetchBrand}
        />
      </section>
    </>
  );
}

export default BrandReport;
