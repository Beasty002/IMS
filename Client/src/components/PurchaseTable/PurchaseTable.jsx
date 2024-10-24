import React, { useEffect, useState } from "react";

function PurchaseTable({
  data = [],
  handleStockEdit,
  editClicked,
  handleDataRetrieve,
  setEditClicked,
}) {
  const [editData, setEditData] = useState([]);
  const [allowSave, setAllowSave] = useState(false);

  let totalQuantity = 0;

  if (editData.length) {
    totalQuantity = editData.reduce(
      (total, product) => total + (parseInt(product?.stock) || 0),
      0
    );
  }

  useEffect(() => {
    if (data) {
      setEditData(data);
    }
  }, [data, editData]);

  // const handleStockChange = (itemId, newQty) => {
  //   setEditData((prevState) =>
  //     prevState.map((item) =>
  //       item._id === itemId ? { ...item, stock: newQty } : item
  //     )
  //   );
  // };

  const handleStockIncrease = (itemId) => {
    console.log(itemId);
    setEditData((prevState) =>
      prevState.map((item) => (item._id === itemId ? item.stock++ : item))
    );
  };

  const handleStockDecrease = (itemId) => {
    console.log(itemId);
    setEditData((prevState) =>
      prevState.map((item) =>
        item._id === itemId ? (item.stock >= 1 ? item.stock-- : item) : item
      )
    );
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
              <tr key={item._id}>
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
                )}{" "}
                <td className="sales-table-prod">
                  {item.parentBrand} {item.parentCat} {item.rowLabel} ({" "}
                  {item.colLabel} )
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
                      value={item?.stock}
                    />
                    <button onClick={() => handleStockIncrease(item._id)}>
                      +
                    </button>
                  </td>
                ) : (
                  <td>{item?.stock || 0}</td>
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
                    handleDataRetrieve(editData, "purchase", newAllowSave);
                    return newAllowSave;
                  });
                }}
                className="save-edit-button"
              >
                <i className="bx bxs-edit"></i>
                <p className="bx-sale">Confirm Edit</p>
              </button>
              <button
                onClick={() => setEditClicked(!editClicked)}
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
    </>
  );
}

export default PurchaseTable;
