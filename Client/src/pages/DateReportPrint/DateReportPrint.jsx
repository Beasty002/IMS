import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function DateReportPrint() {
  const [isPrintAllClicked, setIsPrintAllClicked] = useState(false);
  const location = useLocation();
  const { totalFetchData: data } = location.state || {};

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  const printAll = () => {
    setIsPrintAllClicked(true);
    window.print();
  };

  const printTable = (tableId) => {
    const content = document.getElementById(tableId).outerHTML;
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                color: #333;
              }
      
              table {
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 20px;
                page-break-inside: auto; 
              }
      
              th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: center;
                font-size: 12px;
              }
      
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
      
              tr:nth-child(even) {
                background-color: #f9f9f9; 
              }
      
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
      
                table {
                  width: 100%;
                  table-layout: fixed; 
                }
      
                th, td {
                  font-size: 10pt;
                  padding: 6px;
                }
      
                th {
                  font-size: 11pt;
                }
      
                .print-button {
                  display: none;
                }
      
                tr {
                  page-break-inside: avoid;
                }
      
                @page {
                  size: auto;
                  margin: 10mm;
                }
      
                .page-break {
                  page-break-before: always;
                }
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div
      className="report-table-container main-report-table"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {Object.entries(data)?.map(([key, allValue], index) => (
        <div key={index} className="">
          {allValue?.map((item, itemIndex) => (
            <div className="title-table-group" key={itemIndex}>
              {item.multiVar === true ? (
                <div
                  className={`${item.allColumns.length > 4 ? "vertical-table" : ""
                    }`}
                >
                  <div className="title-print-group"><h1
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    {item.category} / {item.brandName}
                  </h1>
                    {!isPrintAllClicked && (
                      <button
                        className="primary-btn print-button"
                        style={{
                          padding: "10px",
                          width: "max-content",
                          border: "none",
                          borderRadius: "9px",
                        }}
                        onClick={() => printTable(`table-${itemIndex}`)}
                      >
                        Print this
                      </button>
                    )}</div>

                  <table
                    className={`date-report`}
                    style={{
                      marginBottom: "10px",
                      marginTop: "10px",
                    }}
                    key={itemIndex}
                    id={`table-${itemIndex}`}
                  >
                    <thead className="report-table-head">
                      <tr>
                        <th rowSpan="2">S.N</th>
                        <th rowSpan="2">
                          {item.brandRow}/{item.brandCol}
                        </th>
                        {item.allColumns?.map((col, colIndex) => (
                          <th key={colIndex} colSpan="4">
                            {col.column}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        {item.allColumns?.map((col, colIndex) => (
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
                      {Object.entries(item.matrix || {})?.map(
                        ([matrixKey, value], index) => (
                          <tr key={matrixKey}>
                            <td>{index + 1}</td>
                            <td>{matrixKey}</td>
                            {Object.entries(value)?.map(
                              ([innerKey, innerValue], innerIndex) => (
                                <React.Fragment key={innerIndex}>
                                  <td>{innerValue.op}</td>
                                  <td>{innerValue.in}</td>
                                  <td>{innerValue.out}</td>
                                  <td>{innerValue.bal}</td>
                                </React.Fragment>
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>

                </div>
              ) : (
                item.matrix &&
                Object.entries(item.matrix)?.map(
                  ([key, innerValue], innerIndex) => (
                    <>
                      <div className="title-print-group">
                        <h1
                          style={{
                            fontSize: "20px",
                          }}
                        >
                          {item.category} / {item.brandName}
                        </h1>
                        {!isPrintAllClicked && (
                          <button
                            className="primary-btn print-button"
                            style={{
                              padding: "10px",
                              width: "max-content",
                              border: "none",
                              borderRadius: "9px",
                            }}
                            onClick={() => printTable(`table-${innerIndex}`)}
                          >
                            Print this
                          </button>
                        )}
                      </div>
                      <table
                        className="date-report"
                        style={{
                          marginBottom: "10px",
                          marginTop: "10px",
                        }}
                        key={innerIndex}
                        id={`table-${innerIndex}`}
                      >
                        <thead className="report-table-head">
                          <tr>
                            <th rowSpan="2">S.N</th>
                            <th rowSpan="2">{item.brandRow}</th>
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
                          {Object.entries(innerValue)?.map(
                            ([matrixKey, value], index) => (
                              <tr key={matrixKey}>
                                <td>{index + 1}</td>
                                <td>{matrixKey}</td>
                                <td>{value.op}</td>
                                <td>{value.in}</td>
                                <td>{value.out}</td>
                                <td>{value.bal}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>

                    </>
                  )
                )
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        style={{
          padding: "10px",
          border: "none",
          width: "max-content",
          borderRadius: "9px",
        }}
        className="primary-btn print-button"
        onClick={printAll}
      >
        Print all
      </button>
    </div>
  );
}

export default DateReportPrint;
