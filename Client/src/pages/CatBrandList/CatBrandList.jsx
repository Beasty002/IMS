import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";
import { useAuth } from "../../customHooks/useAuth";

export default function CatBrandList() {
  //new thing -> we need to use the variable we defined for dynamic routing here to get the param
  const { categoryName } = useParams();
  const catName = categoryName;

  const [brandIsOpen, setBrandIsOpen] = useState(false);

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
    <>
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
          <>
            <div className="brand-list">
              {fetchBrand?.map((item) => (
                <div className="brand-box" key={item._id}>
                  <h3>
                    {item.brandName} {item.parentCategory}
                  </h3>
                  <p className="brand-stock-availability">
                    Stock available : 80
                  </p>
                  <div className="action-container">
                    <i className="bx bx-edit-alt edit-icon"></i>
                    <i className="bx bx-trash del-icon"></i>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <span>No data found</span>
        )}
        <AddBrand
          isOpen={brandIsOpen}
          onClose={setBrandModel}
          newBrand={newBrand}
        />
      </section>
    </>
  );
}
