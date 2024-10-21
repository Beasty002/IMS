import React, { useEffect, useState } from "react";

function PurchaseTable({
  data = [],
  handleStockEdit,
  editClicked,
  handleDataRetrieve,
}) {
  // 0 is initial value and total is callback and product is var represnting the items inside the data
  // simply added all the stockLeft attribute inside the data
  const [editData, setEditData] = useState([]);

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
      console.log(editData);
    }
  }, [data]);

  const handleStockChange = (itemId, newQty) => {
    setEditData((prevState) =>
      prevState.map((item) =>
        item._id === itemId ? { ...item, stock: newQty } : item
      )
    );
  };

  // useEffect(() => {
  //   if (data) {
  //     console.log("Data yo ho", data);
  //   }
  // }, [data]);

  return (
    <>
      <div className="sale-quantity-table">
        {editClicked ? (
          <button
            onClick={() => handleDataRetrieve(editData,'purchase')}
            className="save-edit-button"
          >
            <i className="bx bxs-edit"></i>
            <p className="bx-sale">Confirm Edit</p>
          </button>
        ) : (
          <></>
        )}
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
                <td className="table-sn">{index + 1}</td>
                <td className="sales-table-prod">
                  {item.parentBrand} {item.parentCat} {item.rowLabel} ({" "}
                  {item.colLabel} )
                </td>
                {editClicked ? (
                  <td>
                    <input
                      onChange={(e) =>
                        handleStockChange(item._id, e.target.value)
                      }
                      className="edit-input"
                      type="text"
                      value={item?.stock}
                    />
                  </td>
                ) : (
                  <td>{item?.stock || 0}</td>
                )}{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-calculate">
        <span>Total Quantity:</span>
        <span>{totalQuantity}</span>
      </div>
    </>
  );
}

export default PurchaseTable;
