import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function DateReportPrint() {
  const location = useLocation();
  const { totalFetchData: data } = location.state || {};

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <>
      <div
        class="report-table-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {Object.entries(data)?.map(([key, allValue], index) => (
          <>
            {allValue?.map((item, index) => (
              <>
                {item.multiVar === true ? (
                  <>
                    <table className="date-report" key={index}>
                      <>
                        <thead class="report-table-head">
                          <tr>
                            <th rowspan="2">S.N</th>
                            <th rowspan="2">
                              {item.brandRow}/{item.brandCol}
                            </th>
                            {item.allColumns?.map((item, index) => (
                              <th colspan="4">{item.column}</th>
                            ))}
                          </tr>
                          <tr>
                            {item.allColumns?.map((item, index) => (
                              <>
                                <th>OP</th>
                                <th>IN</th>
                                <th>OUT</th>
                                <th>BAL</th>
                              </>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(item.matrix)?.map(
                            ([key, value], index) => (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{key}</td>

                                {Object.entries(value)?.map(
                                  ([key, innerValue], innerIndex) => (
                                    <>
                                      <td>{innerValue.op}</td>
                                      <td>{innerValue.in}</td>
                                      <td>{innerValue.out}</td>
                                      <td>{innerValue.bal}</td>
                                    </>
                                  )
                                )}
                              </tr>
                            )
                          )}
                        </tbody>
                      </>
                    </table>
                    <button
                      className="primary-btn"
                      style={{
                        padding: "10px",
                        width: "max-content",
                        border: "none",
                        borderRadius: "9px",
                      }}
                    >
                      Print this shit
                    </button>
                  </>
                ) : (
                  <>
                    {Object.entries(item.matrix)?.map(
                      ([key, innerValue], index) => (
                        <>
                          <table className="date-report" key={index}>
                            <>
                              <thead class="report-table-head">
                                <tr>
                                  <th rowspan="2">S.N</th>
                                  <th rowspan="2">{item.brandRow}</th>

                                  <th colspan="4">{key}</th>
                                </tr>
                                <tr>
                                  <>
                                    <th>OP</th>
                                    <th>IN</th>
                                    <th>OUT</th>
                                    <th>BAL</th>
                                  </>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(innerValue)?.map(
                                  ([key, value], index) => (
                                    <tr>
                                      <>
                                        <td>{index + 1}</td>
                                        <td>{key}</td>

                                        <td>{value.op}</td>
                                        <td>{value.in}</td>
                                        <td>{value.out}</td>
                                        <td>{value.bal}</td>
                                      </>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </>
                          </table>
                          <button
                            className="primary-btn"
                            style={{
                              padding: "10px",
                              width: "max-content",
                              border: "none",
                              borderRadius: "9px",
                            }}
                          >
                            Print this shit
                          </button>
                        </>
                      )
                    )}
                  </>
                )}
              </>
            ))}
          </>
        ))}
        <button
          style={{
            padding: "10px",
            border: "none",
            width: "max-content",
            borderRadius: "9px",
          }}
          className="primary-btn"
        >
          Print all the shit
        </button>
      </div>
    </>
  );
}

export default DateReportPrint;
