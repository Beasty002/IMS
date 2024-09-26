import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CatBrandList.css";
import AddBrand from "../../popups/AddBrand/AddBrand";

export default function CatBrandList() {
  //new thing -> we need to use the variable we defined for dynamic routing here to get the param
  const { categoryName } = useParams();
  const [fetchBrand, setFetchBrand] = useState([]);

  const [brandIsOpen, setBrandIsOpen] = useState(false);

  const setBrandModel = () => {
    setBrandIsOpen(!brandIsOpen);
  };

  const fetchBrandData = async () => {
    try {
      console.log(categoryName);
      const response = await fetch(`http://localhost:3000/api/brandList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryName }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFetchBrand([]);
        console.log("Network error occurred", response.statusText);
        return;
      }
      console.log(data);
      setFetchBrand(data.brands);
    } catch (error) {
      console.error(error);
    }
  };

  const newBrand = () => {
    fetchBrandData();
  };

  useEffect(() => {
    fetchBrandData();
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
        {fetchBrand.length !==0 ? (
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
