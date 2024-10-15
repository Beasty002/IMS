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
  const [tableData, setTableData] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [fetchSingleVarData, setFetchSingleVarData] = useState({});
  const [label, setLabel] = useState([]);

  const { categoryName, brandName } = useParams();

  useEffect(() => {
    console.log("Data is ", dropdownOptions);
  }, [dropdownOptions]);

  const fetchTableData = async () => {
    console.log(JSON.stringify({ cat: categoryName, brand: brandName }));
    try {
      const response = await fetch("http://localhost:3000/api/getTable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cat: categoryName, brand: brandName }),
      });

      if (!response.ok) {
        console.error("Error:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Data is ", data);
      setTableData(data.matrix);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const fetchLabelData = async () => {
    if (specificId) {
      console.log(JSON.stringify({ brandId: specificId }));
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
        console.log(data);
        setLabel(data.type);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (label) {
      console.log(label);
    }
  }, [label]);

  useEffect(() => {
    if (specificId) {
      fetchLabelData();
    }
  }, [specificId]);

  useEffect(() => {
    console.log(fetchSingleVarData);
  }, [fetchSingleVarData]);

  useEffect(() => {
    if (categoryName && brandName) {
      fetchTableData();
    }
  }, [categoryName, brandName]);

  const enableCustPortal = () => setCustPortal(!custPortal);
  const enableCatPortal = () => setCatPortal(!catPortal);

  useEffect(() => {
    if (categoryName) {
      fetchBrandData(categoryName);
    }
  }, [categoryName]);

  const fetchSelectedData = async (event) => {
    const selectedData = event.target.value;
    setSelectedKey(selectedData);
    console.log(
      JSON.stringify({ rowValue: selectedData, brandId: specificId })
    );
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
        console.log(response.statusText);
        return;
      }
      console.log("Singlevar selected data", data);
      setFetchSingleVarData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (fetchBrand && fetchBrand.length > 0) {
      const requiredId = fetchBrand.find(
        (item) => item.brandName === brandName
      );
      setSpecificId(requiredId ? requiredId._id : null);
    }
  }, [fetchBrand, brandName]);

  // const handleValueChange = (key, newValue) => {
  //   setTableData((prevData) => ({
  //     ...prevData,
  //     [selectedKey]: {
  //       ...prevData[selectedKey],
  //       [key]: { ...prevData[selectedKey][key], dfd: newValue },
  //     },
  //   }));
  // };
  useEffect(() => {
    console.log("Yo ho hai table data", tableData);
  }, [tableData]);

  return (
    <>
      <section className="brand-list-page">
        <div className="title-customize-cont">
          <h1>{brandName || "No Brand Selected"}</h1>
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
              <select
                value={selectedKey}
                onChange={(e) => fetchSelectedData(e)}
              >
                <option value="" disabled>
                  -- Select an option --
                </option>
                {label.map((item) => (
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
            // onValueChange={handleValueChange}
            specificId={specificId}
            fetchSingleVarData={fetchSingleVarData}
            selectedKey={selectedKey}
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
