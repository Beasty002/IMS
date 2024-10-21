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
      console.log(editData);
    }
  }, [data]);

  const handleStockChange = (itemId, newQty) => {
    setEditData((prevState) =>
      prevState.map((item) =>
        item._id === itemId ? { ...item, sQty: newQty } : item
      )
    );
  };

  return (
    <>
      <div className="sale-quantity-table">
        {editClicked ? (
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
              <tr key={item?._id || index}>
                <td className="table-sn">{index + 1}</td>
                <td className="sales-table-prod">
                  {item?.sBrand} {item?.sCategory} {item?.sRowLabel} ({" "}
                  {item?.sColLabel} )
                </td>
                {editClicked ? (
                  <td>
                    <input
                      onChange={(e) =>
                        handleStockChange(item._id, e.target.value)
                      }
                      className="edit-input"
                      type="text"
                      value={item?.sQty}
                    />
                  </td>
                ) : (
                  <td>{item?.sQty || 0}</td>
                )}
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

export default SaleTable;
