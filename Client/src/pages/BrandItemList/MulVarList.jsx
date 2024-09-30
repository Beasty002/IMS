import React, { useState, useEffect } from "react";
import "./MulVarList.css";
import CustomizeCol from "../../popups/CustomizeCol/CustomizeCol";
import AddCat from "../../popups/AddCat/AddCat";
import { useParams } from "react-router-dom";

export default function MulVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);

  const { categoryName, brandName } = useParams();

  const enableCustPortal = () => {
    setCustPortal(!custPortal);
  };

  const enableCatPortal = () => {
    setCatPortal(!catPortal);
  };

  return (
    <>
      <section>
        <h1>Mayur Plywoods</h1>
        <section className="brand-list-top mv">
          <div className="search-box">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search items..."
              aria-label="Search input"
            />
          </div>
          <div className="btn-container mv">
            <button onClick={enableCustPortal} className="secondary-btn">
              <i className="bx bx-filter-alt"></i>
              Customize Columns
            </button>
            <button onClick={enableCatPortal} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Brand
            </button>
          </div>
        </section>
      </section>

      <section>
        <div className="brand-item-table">
          <table>
            <thead>
              <tr>
                <th className="table-checkbox">
                  <input type="checkbox" />
                </th>
                <th>Size/mm</th>
                <th>6mm</th>
                <th>10mm</th>
                <th>16mm</th>
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
                <td>12</td>
                <td>12</td>
                <td className="table-action-container">
                  <div className="action-container">
                    <i className="bx bx-edit-alt edit-icon"></i>
                    <i className="bx bx-trash del-icon"></i>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CustomizeCol isOpen={custPortal} onClose={enableCustPortal} />
        <AddCat
          isOpen={catPortal}
          onClose={enableCatPortal}
          type="item"
          multiVar="true"
          catName={categoryName}
          brndName={brandName}
        />
      </section>
    </>
  );
}
