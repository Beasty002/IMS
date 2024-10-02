import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SinVarList.css";
import CustomizeCol from "../../popups/CustomizeCol/CustomizeCol";
import AddCat from "../../popups/AddCat/AddCat";
import { useAuth } from "../../customHooks/useAuth";

export default function SinVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);
  const { fetchBrandData, fetchBrand } = useAuth();
  const [specificId, setSpecificId] = useState();

  const { categoryName, brandName } = useParams();

  const enableCustPortal = () => {
    setCustPortal(!custPortal);
  };

  const enableCatPortal = () => {
    setCatPortal(!catPortal);
  };

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    if (fetchBrand && fetchBrand.length > 0) {
      const requiredId = fetchBrand.find(
        (item) => item.brandName === brandName
      );
      setSpecificId(requiredId._id);
      console.log(specificId);
    }
  }, [fetchBrand, brandName]);

  useEffect(() => {
    console.log(fetchBrand);
  }, [fetchBrand]);

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
              <input
                type="text"
                placeholder="Search items..."
                aria-label="Search input"
              />
            </div>
            <div className="sel-container">
              <select name="" id="">
                <option value="">SD</option>
                <option value="">MF</option>
                <option value="">godawari</option>
              </select>
            </div>
          </div>

          <div className="btn-container sp">
            <button onClick={enableCustPortal} className="secondary-btn">
              <i className="bx bx-filter-alt"></i>
              Customize Types
            </button>
            <button onClick={enableCatPortal} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Item
            </button>
          </div>
        </section>
      </section>
      <section>
        <div className="brand-item-table single-var">
          <table>
            <thead>
              <tr>
                <th className="table-checkbox">
                  <input type="checkbox" />
                </th>
                <th>Code</th>
                <th className="stock-count-single">Stock</th>

                <th className="table-action-container">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="table-checkbox">
                  <input type="checkbox" />
                </td>
                <td>1000</td>
                <td>1000</td>

                <td className="table-action-container single-table">
                  <div className="action-container">
                    <i className="bx bx-edit-alt edit-icon"></i>
                    <i className="bx bx-trash del-icon"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CustomizeCol isOpen={custPortal} onClose={enableCustPortal} specificId={specificId}/>
        <AddCat
          isOpen={catPortal}
          onClose={enableCatPortal}
          type="column"
          specificId={specificId}
        />
      </section>
    </>
  );
}
