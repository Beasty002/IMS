import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SinVarList.css";
import AddCat from "../../popups/AddCat/AddCat";
import { useAuth } from "../../customHooks/useAuth";
import SingleVarTable from "../../components/SingleVarTable/SingleVarTable";
import CustomizeSingleCol from "../../popups/CustomizeSingleCol/CustomizeSingleCol";

export default function SinVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);
  const { fetchBrandData, fetchBrand } = useAuth();
  const [specificId, setSpecificId] = useState();
  const [selectedKey, setSelectedKey] = useState("");
  const [fetchSingleVarData, setFetchSingleVarData] = useState({});
  const [codeDropDown, setCodeDropDown] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { categoryName, brandName } = useParams();

  const getLabelData = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/getLabels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandId: specificId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      setCodeDropDown(data.type);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (specificId) {
      getLabelData();
    }
  }, [specificId]);

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
      setSpecificId(requiredId ? requiredId._id : null);
    }
  }, [fetchBrand, brandName]);

  const fetchSelectedData = async (event) => {
    const selectedData = event.target.value;
    setSelectedKey(selectedData);
    try {
      const response = await fetch("http://localhost:3000/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rowValue: selectedData, brandId: specificId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setFetchSingleVarData();
        return;
      }
      setFetchSingleVarData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (rowKey) => {
    try {
      const response = await fetch("http://localhost:3000/api/type", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rowKey: rowKey, brandId: specificId }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };


  const enableCustPortal = () => setCustPortal(!custPortal);
  const enableCatPortal = () => setCatPortal(!catPortal);

  useEffect(() => {
    console.log("YO aauna prne ho", brandName);
  }, [brandName]);

  return (
    <>
      <section className="brand-list-page">
        <div className="title-customize-cont">
          <h1>
            {brandName} {categoryName}
          </h1>
        </div>

        <section className="brand-list-top sp">
          <div className="search-select-container">
            <div className="search-box">
              <i className="bx bx-search-alt"></i>
              <input
                type="text"
                placeholder="Search items..."
                aria-label="Search input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sel-container">
              <select
                value={selectedKey}
                onChange={(e) => fetchSelectedData(e)}
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                {codeDropDown.map((item, index) => (
                  <option key={item._id} value={item.type}>
                    {item.type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="btn-container sp">
            <button onClick={enableCustPortal} className="secondary-btn">
              <i className="bx bx-filter-alt"></i> Customize Types
            </button>
            <button onClick={enableCatPortal} className="primary-btn">
              <i className="bx bx-plus-circle"></i> New Item
            </button>
          </div>
        </section>
      </section>

      <section>
        {selectedKey && (
          <SingleVarTable
            specificId={specificId}
            fetchSingleVarData={fetchSingleVarData}
            selectedKey={selectedKey}
            searchTerm={searchTerm}
          />
        )}
        <CustomizeSingleCol
          isOpen={custPortal}
          onClose={enableCustPortal}
          specificId={specificId}
          selectedKey={selectedKey}
          fetchSingleVarData={fetchSingleVarData}
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
