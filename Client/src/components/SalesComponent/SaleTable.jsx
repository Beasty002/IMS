import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

function SaleTable({
  data = [],
  handleStockEdit,
  editClicked,
  handleDataRetrieve,
  setEditClicked,
}) {
  const [editData, setEditData] = useState([]);
  const [allowSave, setAllowSave] = useState(false);
  const [startingStock, setStartingStock] = useState({});

  let totalQuantity;

  if (editData) {
    totalQuantity = editData.reduce(
      (total, product) => total + (parseInt(product?.sQty) || 0),
      0
    );
  }

  useEffect(() => {
    if (data) {
      setEditData(data);
      console.log("Yo edit data ho", editData);
    }
  }, [data, editData]);

  useEffect(() => {
    if (data) {
      setEditData(data);

      const initialStockData = data.reduce((acc, item) => {
        acc[item._id] = item.sQty;
        return acc;
      }, {});
      setStartingStock(initialStockData);

      console.log("Initial stock data set:", initialStockData);
    }
  }, [data]);

  // const handleStockChange = (itemId, newQty) => {
  //   setEditData((prevState) =>
  //     prevState.map((item) =>
  //       item._id === itemId ? { ...item, sQty: newQty } : item
  //     )
  //   );
  // };

  const handleStockIncrease = (itemId) => {
    console.log(itemId);

    // const previousStockData = editData.find((item) => item._id === itemId);
    // setStartingStock(previousStockData.sQty);

    // console.log("Starting stock is",startingStock);

    setEditData((prevState) =>
      prevState.map((item) => (item._id === itemId ? item.sQty++ : item))
    );
    checkValidation(itemId);
  };

  const handleStockDecrease = (itemId) => {
    console.log("Yo call vaxa hai");
    setEditData((prevState) =>
      prevState.map((item) =>
        item._id === itemId ? (item.sQty >= 1 ? item.sQty-- : item) : item
      )
    );
  };

  const handleSaleDelete = (itemId) => {
    console.log("Delete vayo hai");
    setEditData((prevState) => prevState.filter((item) => item._id !== itemId));
  };

  // const getStartingStock = (itemId) => {
  //   const stocks = editData.find((item) => item._id === itemId);
  //   console.log("STocks haru yei ho hai ta kta ho", stocks);
  //   setStartingStock([...startingStock, stocks]);
  // };

  const checkValidation = async (itemId) => {
    const newQuantity = editData.find((item) => item._id === itemId);
    // const productId = newQuantity._id;
    // const productQuantity = newQuantity.sQty;
    // const productName = newQuantity.sColLabel;
    // console.log("Naya quantity", newQuantity);
    const initialQuantity = startingStock[itemId];
    console.log(
      "Fetch hanne data",
      JSON.stringify({
        newQuantity,
        initialQuantity: initialQuantity,
      })
    );
    try {
      const response = await fetch("http://localhost:3000/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newQuantity,
          initialQuantity: initialQuantity,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log("Repsone yo hai", data.updateStatus);
      if (data.updateStatus === false) {
        // console.log("Fetch bhitra ko id", itemId);
        // toast.error("Not enough stock");
        handleStockDecrease(itemId);
        return;
      } else {
        console.log("Chalxa");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(editData);
  }, [editData]);

  return (
    <>
      <div className="sale-quantity-table">
        <table>
          <thead className="sale-qnt-table">
            <tr>
              <th className="table-sn">S.N</th>
              <th className="sales-table-prod">Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {editData?.map((item, index) => (
              <tr className="single-row" key={item?._id || index}>
                {editClicked ? (
                  <td>
                    <i
                      onClick={() => handleSaleDelete(item._id)}
                      className="bx bx-trash del-icon"
                    ></i>
                  </td>
                ) : (
                  <>
                    <td className="table-sn">{index + 1}</td>
                  </>
                )}
                <td className="sales-table-prod">
                  {item?.sBrand} {item?.sCategory} {item?.sRowLabel} ({" "}
                  {item?.sColLabel} )
                </td>
                {editClicked ? (
                  <td className="edits-btns">
                    {allowSave ? (
                      <>{item?.sQty || 0}</>
                    ) : (
                      <>
                        <button onClick={() => handleStockDecrease(item._id)}>
                          -
                        </button>
                        <input
                          onChange={(e) =>
                            handleStockChange(item._id, e.target.value)
                          }
                          className="edit-input"
                          type="text"
                          value={item?.sQty}
                        />
                        <button
                          onClick={() => {
                            handleStockIncrease(item._id);
                          }}
                        >
                          +
                        </button>
                      </>
                    )}
                  </td>
                ) : (
                  <td>{item?.sQty || 0}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editClicked ? (
        <>
          {!allowSave ? (
            <div className="total-calculate">
              <button
                onClick={() => {
                  setAllowSave((prevAllowSave) => {
                    const newAllowSave = !prevAllowSave;
                    handleDataRetrieve(editData, "sales", newAllowSave);
                    return newAllowSave;
                  });
                }}
                className="save-edit-button"
              >
                <i className="bx bxs-edit"></i>
                <p className="bx-sale">Confirm Edit</p>
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                style={{
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                className="save-edit-button"
              >
                <i className="bx bxs-edit"></i>
                <p className="bx-sale">Cancel Edit</p>
              </button>
            </div>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <div className="total-calculate">
            <span>Total Quantity:</span>
            <span>{totalQuantity}</span>
          </div>
        </>
      )}
      {/* <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={false}
      /> */}
    </>
  );
}

export default SaleTable;
