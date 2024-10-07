import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SinVarList.css";
import CustomizeCol from "../../popups/CustomizeCol/CustomizeCol";
import AddCat from "../../popups/AddCat/AddCat";
import { useAuth } from "../../customHooks/useAuth";
import SingleVarTable from "../../components/SingleVarTable/SingleVarTable";

export default function SinVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);
  const { fetchBrandData, fetchBrand } = useAuth();
  const { categoryName, brandName } = useParams();
  const [tableData, setTableData] = useState({});
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    if (categoryName && brandName) {
      fetch("http://localhost:3000/api/getTable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cat: categoryName, brand: brandName }),
      })
        .then((response) => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then((data) => setTableData(data.matrix))
        .catch((error) => console.error("Fetch error:", error));
    }
  }, [categoryName, brandName]);

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, [categoryName]);

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  return (
    <>
      <section className="brand-list-page">
        <div className="title-customize-cont">
          <h1>Mayur Plywoods</h1>
        </div>
        <section className="brand-list-top sp">
          <div className="search-select-container">
            <div className="search-box">
              <i className="bx bx-search-alt"></i>
              <input type="text" placeholder="Search items..." aria-label="Search input" />
            </div>
            <div className="sel-container">
              <select onChange={handleBrandChange} value={selectedBrand}>
                <option value="">Select Brand</option>
                {Object.keys(tableData).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="btn-container sp">
            <button onClick={() => setCustPortal(!custPortal)} className="secondary-btn">
              <i className="bx bx-filter-alt"></i> Customize Types
            </button>
            <button onClick={() => setCatPortal(!catPortal)} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Item
            </button>
          </div>
        </section>
      </section>
      <section>
        <SingleVarTable data={selectedBrand ? tableData[selectedBrand] : {}} />
        <CustomizeCol isOpen={custPortal} onClose={() => setCustPortal(false)} />
        <AddCat isOpen={catPortal} onClose={() => setCatPortal(false)} type="item" specialCase="column" />
      </section>
    </>
  );
}
