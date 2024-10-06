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
  const [specificId, setSpecificId] = useState();
  const [tableData, setTableData] = useState({});

  const { categoryName, brandName } = useParams();

  const fetchTableData = async () => {
    try {
      console.log(JSON.stringify({ cat: categoryName, brand: brandName }));
      const response = await fetch("http://localhost:3000/api/getTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cat: categoryName,
          brand: brandName,
        }),
      });

      if (!response.ok) {
        console.log("Error:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log(data);
      setTableData(data.matrix);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    if (categoryName && brandName) {
      fetchTableData();
    }
  }, [categoryName, brandName]);

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
        <SingleVarTable />
        <CustomizeCol
          isOpen={custPortal}
          onClose={enableCustPortal}
          specificId={specificId}
        />
        <AddCat
          isOpen={catPortal}
          onClose={enableCatPortal}
          type="item"
          specialCase="column"
          specificId={specificId}
        />
      </section>
    </>
  );
}
