import React, { useState, useEffect } from "react";
import "./MulVarList.css";
import CustomizeCol from "../../popups/CustomizeCol/CustomizeCol";
import AddCat from "../../popups/AddCat/AddCat";
import { useParams } from "react-router-dom";
import { useAuth } from "../../customHooks/useAuth";

export default function MulVarList() {
  const [custPortal, setCustPortal] = useState(false);
  const [catPortal, setCatPortal] = useState(false);
  const [specificId, setSpecificId] = useState();
  const [fetchedBdata, setFetchedBdata] = useState({});
  const [tableData, setTableData] = useState({});

  const { fetchBrandData, fetchBrand } = useAuth();
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
      if (requiredId) {
        setSpecificId(requiredId._id);
      }
    }
  }, [fetchBrand, brandName]);

  const fetchRespectiveBrandData = async () => {
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
        setFetchedBdata(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

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
    if (specificId) {
      fetchRespectiveBrandData();
    }
  }, [specificId]);

  useEffect(() => {
    if (fetchedBdata && categoryName && brandName) {
      fetchTableData();
    }
  }, [fetchedBdata]);

  useEffect(() => {
    if (tableData) {
      console.log(tableData);
    }
  }, [tableData]);

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
                <th>
                  {fetchedBdata.rowLabel}/{fetchedBdata.colLabel}
                </th>
                {/* object.keys returns the variable name that the value is assigned to  */}
                {tableData &&
                  tableData.firstRow &&
                  Object.keys(tableData.firstRow).map((colName, index) => (
                    <th key={index}>{colName}</th>
                  ))}
                <th className="table-action-container">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* we map the outer variable of the object to dyanmically display the data */}
               {tableData &&
                Object.keys(tableData).map((rowKey, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="table-checkbox">
                      <input type="checkbox" />
                    </td>
                    <td>{rowKey}</td>
                    {/* Loop through each row's values and display in respective columns */}
                    {tableData[rowKey] &&
                      Object.values(tableData[rowKey]).map(
                        (value, colIndex) => <td key={colIndex}>{value}</td>
                      )}
                    <td className="table-action-container">
                      <div className="action-container">
                        <i className="bx bx-edit-alt edit-icon"></i>
                        <i className="bx bx-trash del-icon"></i>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <CustomizeCol
          isOpen={custPortal}
          onClose={enableCustPortal}
          specificId={specificId}
        />
        <AddCat
          isOpen={catPortal}
          onClose={enableCatPortal}
          type="item"
          multiVar="true"
          specificId={specificId}
        />
      </section>
    </>
  );
}
