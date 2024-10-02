import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";
import { useAuth } from "../../customHooks/useAuth";
import AddCat from "../../popups/AddCat/AddCat";

export default function CatBrandList() {
  //new thing -> we need to use the variable we defined for dynamic routing here to get the param
  const { categoryName } = useParams();
  const catName = categoryName;
  const brandNameRef = useRef(null);

  const [brandIsOpen, setBrandIsOpen] = useState(false);
  const [brandUpdate, setBrandUpdate] = useState(false);

  const handleBrandUpdate = (event) => {
    if (brandNameRef.current) {
      const brandName = brandNameRef.current.textContent.split(" ")[0];   
      console.log(brandName);
    }
    event.preventDefault();
    setBrandUpdate(!brandUpdate);
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
                <Link
                  key={item._id}
                  to={`/catband/${item.parentCategory}/${item.brandName}/${item.multiVar}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="brand-box">
                    <h3 ref={brandNameRef}>
                      {item.brandName} {item.parentCategory}
                    </h3>
                    <p className="brand-stock-availability">
                      Stock available: 80
                    </p>
                    <div className="action-container">
                      <i
                        onClick={handleBrandUpdate}
                        className="bx bx-edit-alt edit-icon"
                      ></i>
                      <i className="bx bx-trash del-icon"></i>
                    </div>
                  </div>
                </Link>
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
        <AddCat
          isOpen={brandUpdate}
          onClose={handleBrandUpdate}
          type="Brand Name"
        />
      </section>
    </>
  );
}
