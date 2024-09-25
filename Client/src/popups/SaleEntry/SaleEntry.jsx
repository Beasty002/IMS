import React, { useState } from "react";
import ReactDOM from "react-dom";

function SaleEntry({ isOpen, onClose }) {
  const [addInput, setAddInput] = useState([
    {
      id: Date.now(),
      category: "",
      brand: "",
      rowLabel: "",
      colLabel: "",
      counter: 0,
    },
  ]);

  const addNewList = (event) => {
    event.preventDefault();
    setAddInput([
      ...addInput,
      {
        id: Date.now() + Math.random(),
        category: "",
        brand: "",
        rowLabel: "",
        colLabel: "",
        counter: 0,
      },
    ]);
  };

  // here each select is treated as a sinle so there will be only one field 
  
  const handleDataInsert = async (itemId, field, value) => {
    setAddInput(
      addInput.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    );

    const categoryName = addInput
      .map((item) => (item.id === itemId ? item.category : null))
      // this filter(Boolean) removes any falsy value like null,false,undefined
      // which will left us with our required value of the selected category and[0] representts
      // the first index as it is still in array form
      .filter(Boolean)[0];

    try {
      const response = await fetch("http://localhost:3000/api/categoryData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: categoryName }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("Network error");
        return;
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrement = (itemId) => {
    setAddInput(
      addInput.map((item) =>
        item.id === itemId
          ? { ...item, counter: Math.max(0, item.counter - 1) }
          : item
      )
    );
  };

  const handleIncrement = (itemId) => {
    setAddInput(
      addInput.map((item) =>
        item.id === itemId ? { ...item, counter: item.counter + 1 } : item
      )
    );
  };

  const handleDelete = (itemId) => {
    setAddInput((prevState) => prevState.filter((item) => item.id !== itemId));
  };

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <div id="newSales">
        <h2>Sales Entry</h2>
        <div className="search-box">
          <i className="bx bx-search-alt"></i>
          <input
            type="text"
            placeholder="Search items to add..."
            aria-label="Search input"
          />
        </div>
        <section className="sales-item-container">
          <form>
            <section className="sales-entry-items-list">
              {addInput?.map((item, index) => (
                <div key={index} className="sales-entry-item">
                  <i
                    onClick={() => handleDelete(item.id)}
                    class="bx bx-trash del-icon"
                  ></i>
                  <select
                    value={item.category}
                    onChange={(event) =>
                      handleDataInsert(item.id, "category", event.target.value)
                    }
                    name="cat"
                    className="cat-select"
                  >
                    <option value="">Select Category</option>
                    <option value="Plywood">Plywood</option>
                    <option value="Doors">Doors</option>
                  </select>
                  <select
                    value={item.brand}
                    onChange={(event) =>
                      handleDataInsert(item.id, "brand", event.target.value)
                    }
                    name="cat"
                    className="brand-select"
                  >
                    <option value="">Select Brand</option>
                    <option value="Mayur">Mayur</option>
                    <option value="Greenlam">Greenlam</option>
                  </select>
                  <select
                    value={item.rowLabel}
                    onChange={(event) =>
                      handleDataInsert(item.id, "rowLabel", event.target.value)
                    }
                    name="cat"
                    className="row-select"
                  >
                    <option value=""> Select RowLabel</option>
                    <option value="mayur">mayur</option>
                    <option value="Greenlam">Greenlam</option>
                  </select>
                  <select
                    value={item.colLabel}
                    onChange={(event) =>
                      handleDataInsert(item.id, "colLabel", event.target.value)
                    }
                    name="cat"
                    className="column-select"
                  >
                    <option value="">Select ColLabel</option>
                    <option value="mayur">mayur</option>
                    <option value="Greenlam">Greenlam</option>
                  </select>
                  <div className="sales-entry-qty">
                    <i
                      onClick={() => handleDecrement(item.id)}
                      className="bx bxs-minus-circle"
                    ></i>
                    <input
                      type="number"
                      id="quantity"
                      name="qty"
                      value={item.counter}
                    />
                    <i
                      onClick={() => handleIncrement(item.id)}
                      className="bx bxs-plus-circle"
                    ></i>
                  </div>
                </div>
              ))}

              <div className="new-item">
                <span></span>
                <div className="btn-container">
                  <button onClick={addNewList} className="secondary-btn">
                    + New Item
                  </button>
                </div>
              </div>
            </section>
            <div className="btn-container new-entry-btn-container">
              <button className="cancel-btn">Cancel</button>
              <button className="primary-btn">Add</button>
            </div>
          </form>
        </section>
      </div>
    </>,
    document.getElementById("overlay")
  );
}

export default SaleEntry;
