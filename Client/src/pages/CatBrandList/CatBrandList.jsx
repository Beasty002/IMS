import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";
import { useAuth } from "../../customHooks/useAuth";
import AddCat from "../../popups/AddCat/AddCat";

export default function CatBrandList() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const catName = categoryName;

  const brandRefs = useRef([]);

  const [brandIsOpen, setBrandIsOpen] = useState(false);
  const [brandUpdate, setBrandUpdate] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState(null);

  // because of event propagation or bubbling effect we
  //  shifted the use to navigate instead of Link
  const handleBrandNavigation = (item) => {
    navigate(
      `/catband/${item.parentCategory}/${item.brandName}/${item.multiVar}`
    );
  };

  const handleBrandUpdate = (index, brandId) => (event) => {
    // this prevent the parent navigation function to be triggered
    // and isolated the children event
    event.stopPropagation();
    if (brandRefs.current[index]) {
      setSelectedBrandId(brandId);
      console.log(brandId);
      setBrandUpdate(true);
    }
  };

  const setBrandModel = () => {
    setBrandIsOpen(!brandIsOpen);
  };

  const { fetchBrand, fetchBrandData } = useAuth();

  const newBrand = () => {
    fetchBrandData(catName);
  };

  useEffect(() => {
    fetchBrandData(catName);
  }, [categoryName]);

  return (
    <section>
      <h1>{categoryName} Brands</h1>
      <div className="brand-list-top">
        <div className="search-box">
          <i className="bx bx-search-alt"></i>
          <input
            type="text"
            placeholder="Search brands..."
            aria-label="Search input"
          />
        </div>
        <div className="btn-container">
          <button onClick={setBrandModel} className="primary-btn">
            <i className="bx bx-plus-circle"></i> New Brand
          </button>
        </div>
      </div>
      {fetchBrand.length !== 0 ? (
        <div className="brand-list">
          {fetchBrand.map((item, index) => (
            <div key={item._id} className="brand-box">
              <h3
                ref={(el) => (brandRefs.current[index] = el)}
                onClick={() => handleBrandNavigation(item)}
              >
                {item.brandName} {item.parentCategory}
              </h3>
              <p className="brand-stock-availability">Stock available: 80</p>
              <div className="action-container">
                <i
                  onClick={handleBrandUpdate(index, item._id)}
                  className="bx bx-edit-alt edit-icon"
                ></i>
                <i className="bx bx-trash del-icon"></i>
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
    </section>
  );
}
