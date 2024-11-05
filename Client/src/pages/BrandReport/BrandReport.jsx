import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";
import ReportPrint from "../../popups/ReportPrint/ReportPrint";
import { useNavigate } from "react-router-dom";

function BrandReport() {
  const { categoryName } = useParams();
  const { fetchBrandData, fetchBrand, stockData } = useAuth();
  const [enablePortal, setEnablePortal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBrands, setFilteredBrands] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, []);

  useEffect(() => {
    console.log("Yo fetchBrand ho hai", fetchBrand);
  }, [fetchBrand]);

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

  const handleFinalRedirect = (brandId, parentCategory, multiVar) => {
    console.log(" brandname yo ho hai", brandId, parentCategory);
    navigate(`/finalReport/${parentCategory}/${brandId}/${multiVar}`);
  };

  const fetchBrandReport = async () => {
    console.log(JSON.stringify({ fetchBrand }));
    try {
      const response = await fetch("http://localhost:3000/api/brandsReports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fetchBrand }),
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
              placeholder="Search brands..."
              aria-label="Search input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <button onClick={fetchBrandReport} className="primary-btn">
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
              <div
                onClick={() =>
                  handleFinalRedirect(
                    item._id,
                    item.parentCategory,
                    item.multiVar
                  )
                }
                key={item._id}
                className="cat-box"
              >
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
          // fetchBrand={fetchBrand}
          onClose={() => setEnablePortal(!enablePortal)}
          data={fetchBrand}
        />
      </section>
    </>
  );
}

export default BrandReport;
