import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";
import { useAuth } from "../../customHooks/useAuth";
import AddCat from "../../popups/AddCat/AddCat";
import DelPop from "../../popups/DelPop/DelPop";

export default function CatBrandList() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const catName = categoryName;

  const brandRefs = useRef([]);

  const [brandIsOpen, setBrandIsOpen] = useState(false);
  const [brandUpdate, setBrandUpdate] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selDeleteId, setSelDeleteId] = useState(null);
  const [delPopupOpen, setDelPopupOpen] = useState(false);
  const [delBrandName, setDelBrandName] = useState(null);
  const [searchData, setSearchData] = useState("");

  const handleBrandNavigation = (item) => {
    navigate(
      `/catband/${item.parentCategory}/${item.brandName}/${item.multiVar}`
    );
  };

  const handleBrandUpdate = (index, brandId) => (event) => {
    event.stopPropagation();
    if (brandRefs.current[index]) {
      setSelectedBrandId(brandId);
      setBrandUpdate(true);
    }
  };

  const handleDeleteIcon = (index, brandId, delBrand) => (event) => {
    event.stopPropagation();

    if (brandRefs.current[index]) {
      setSelDeleteId(brandId);
      setDelBrandName(delBrand);
      setDelPopupOpen(true);
    }
  };

  const setBrandModel = () => {
    setBrandIsOpen(!brandIsOpen);
  };

  const { fetchBrand, fetchBrandData, stockData } = useAuth();

  const newBrand = () => {
    fetchBrandData(catName);
  };

  useEffect(() => {
    fetchBrandData(catName);
  }, [categoryName]);

  useEffect(() => {
    if (searchData) {
      console.log(searchData);
    }
  }, [searchData]);

  const filteredBrands = fetchBrand.filter((item) =>
    item.brandName.toLowerCase().includes(searchData.toLowerCase())
  );

  return (
    <section>
      <h1>{categoryName} Brands</h1>
      <div className="brand-list-top">
        <div className="search-box">
          <i className="bx bx-search-alt"></i>
          <input
            type="text"
            placeholder="Search brands..."
            value={searchData}
            onChange={(event) => setSearchData(event.target.value)}
            aria-label="Search input"
          />
        </div>
        <div className="btn-container">
          <button onClick={setBrandModel} className="primary-btn">
            <i className="bx bx-plus-circle"></i> New Type
          </button>
        </div>
      </div>
      {filteredBrands.length !== 0 ? (
        <div className="brand-list">
          {filteredBrands.map((item, index) => (
            <div key={item._id} className="brand-box">
              <h3
                ref={(el) => (brandRefs.current[index] = el)}
                onClick={() => handleBrandNavigation(item)}
              >
                {item.brandName} {item.parentCategory}
              </h3>
              <p className="brand-stock-availability">
                Stock available: {stockData[item.brandName]}
              </p>
              <div className="action-container">
                <i
                  onClick={handleBrandUpdate(index, item._id)}
                  className="bx bx-edit-alt edit-icon"
                ></i>
                <i
                  onClick={handleDeleteIcon(index, item._id, item.brandName)}
                  className="bx bx-trash del-icon"
                ></i>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <span>No data found</span>
      )}
      <AddBrand
        isOpen={brandIsOpen}
        onClose={setBrandModel}
        newBrand={newBrand}
      />
      <AddCat
        isOpen={brandUpdate}
        onClose={() => setBrandUpdate(false)}
        type="rename"
        specificId={selectedBrandId}
      />
      <DelPop
        isOpen={delPopupOpen}
        onClose={() => setDelPopupOpen(false)}
        specificId={selDeleteId}
        delBrandName={delBrandName}
      />
    </section>
  );
}
