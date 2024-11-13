import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Preview.css";

function Preview() {
  const [totalFetchData, setTotalFetchData] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { selectedItems = [], selectedTitles = [] } = location.state || {};
  const [matrixKey, setMatrixKey] = useState({});
  const [brandId, setBrandId] = useState("");
  const [title, setTitle] = useState("");
  const [singleVarFetch, setSingleVarFetch] = useState([]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      selectedItems.forEach((item, index) => {
        fetchTotalData(item, index);
      });
    }
  }, [selectedItems]);

  useEffect(() => {
    console.log("YO ho hai fetch data", totalFetchData);
  }, [totalFetchData]);

  const fetchTotalData = async (brandId, index) => {
    console.log("Fetching data for brandId:", brandId);
    setBrandId(brandId);

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setMatrixKey(Object.keys(data.matrix));
      setTotalFetchData((prevState) => [
        ...prevState,
        { data, title: selectedTitles[index] || "Unnamed Report" },
      ]);
      setTitle(totalFetchData.title);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (matrixKey && brandId) {
      for (let i = 0; i <= matrixKey.length - 1; i++) {
        fetchSpecificSingleData(matrixKey[i], brandId);
      }
    }
  }, [matrixKey]);

  const fetchSpecificSingleData = async (matrixKey, brandId) => {
    console.log(JSON.stringify({ matrixKey, brandId }));
    try {
      const response = await fetch("http://localhost:3000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ matrixKey, brandId }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setSingleVarFetch((prevState) => [...prevState, { data }]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("Yo ho hai te key", totalFetchData);
  }, [totalFetchData]);

  return (
    <>
      <div className="total-out report-all-container-print">
        <div id="report-content">
          {totalFetchData.map((item, index) => {
            return (
              <div key={index} className="report-table-container">
                <h1
                  style={{
                    fontSize: "20px",
                  }}
                  className="table-title"
                >
                  {item.title} {item.data.category}
                </h1>

                {item.data && item.data.multiVar ? (
                  <table>
                    <thead className="report-table-head">
                      <tr>
                        <th rowSpan={2}>S.N</th>
                        <th rowSpan={2}>
                          {item.data.brandCol
                            ? `${item.data.brandRow}/${item.data.brandCol}`
                            : item.data.brandRow}
                        </th>
                        {item.data.allColumns?.map((col, colIndex) => (
                          <th key={colIndex} colSpan={4}>
                            {col.column}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        {item.data.allColumns?.map((_, colIndex) => (
                          <React.Fragment key={colIndex}>
                            <th>OP</th>
                            <th>IN</th>
                            <th>OUT</th>
                            <th>BAL</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(item.data.matrix || {}).map(
                        ([rowLabel, rowData], rowIndex) => {
                          if (!rowData || Object.keys(rowData).length === 0)
                            return null;

                          return (
                            <tr key={rowIndex}>
                              <td>{rowIndex + 1}</td>
                              <td>{rowLabel}</td>
                              {item.data.allColumns.map((col, colIndex) => {
                                const colData = rowData[col.column];

                                return (
                                  <React.Fragment key={colIndex}>
                                    <td>
                                      {colData?.op !== undefined
                                        ? colData.op
                                        : ""}
                                    </td>
                                    <td>
                                      {colData?.in !== undefined
                                        ? colData.in
                                        : ""}
                                    </td>
                                    <td>
                                      {colData?.out !== undefined
                                        ? colData.out
                                        : ""}
                                    </td>
                                    <td>
                                      {colData?.bal !== undefined
                                        ? colData.bal
                                        : ""}
                                    </td>
                                  </React.Fragment>
                                );
                              })}
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                ) : (
                  <div className="single-report-css">
                    {singleVarFetch &&
                      singleVarFetch.map((item, itemIndex) => (
                        <div
                          key={`item-${itemIndex}`}
                          style={{ marginBottom: "30px" }}
                        >
                          {Object.entries(item.data.matrix || {}).map(
                            ([key, value], index) => (
                              <table
                                key={`table-${key}-${index}`}
                                style={{ marginBottom: "30px" }}
                                className="table1"
                              >
                                <thead className="report-table-head">
                                  <tr>
                                    <th rowSpan="2">S.N</th>
                                    <th rowSpan="2">Code</th>
                                    <th colSpan="4">{key}</th>
                                  </tr>
                                  <tr>
                                    <th>OP</th>
                                    <th>IN</th>
                                    <th>OUT</th>
                                    <th>BAL</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(value || {}).map(
                                    ([innerKey, innerValue], innerIndex) => (
                                      <tr
                                        key={`row-${key}-${innerKey}-${innerIndex}`}
                                      >
                                        <td>{innerIndex + 1}</td>
                                        <td>{innerKey}</td>
                                        {Object.entries(innerValue || {}).map(
                                          ([_, cellValue], colIndex) => (
                                            <td
                                              key={`cell-${key}-${innerKey}-${colIndex}`}
                                            >
                                              {cellValue}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            )
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="print-btn-container">
          <button
            onClick={() => window.print()}
            className="primary-btn print-btn-main"
            id="print-btn"
          >
            Print
          </button>
        </div>

      </div>
      {isLoading && (
        <div className="center-hanne">
          <div className="bhitri-center">
            <span
              style={{ textAlign: "center", color: "white", fontSize: "25px" }}
            >
              Generating Report
            </span>
            <div className="box"></div>
          </div>
        </div>
      )}
    </>
  );
}

export default Preview;
