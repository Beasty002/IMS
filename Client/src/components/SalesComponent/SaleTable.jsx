import React, { useEffect, useState } from "react";

function SaleTable({
  data = [],
  handleStockEdit,
  editClicked,
  handleDataRetrieve,
}) {
  const [editData, setEditData] = useState([]);
  const [allowSave, setAllowSave] = useState(false);

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

  // const handleStockChange = (itemId, newQty) => {
  //   setEditData((prevState) =>
  //     prevState.map((item) =>
  //       item._id === itemId ? { ...item, sQty: newQty } : item
  //     )
  //   );
  // };

  const handleStockIncrease = (itemId) => {
    console.log(itemId);
    setEditData((prevState) =>
      prevState.map((item) => (item._id === itemId ? item.sQty++ : item))
    );
  };

  const handleStockDecrease = (itemId) => {
    console.log(itemId);
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
                    <button onClick={() => handleStockIncrease(item._id)}>
                      +
                    </button>
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
          {editClicked ? (
            <>
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
              <button>Cancel Edit</button>
            </>
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
    </>
  );
}

export default SaleTable;
