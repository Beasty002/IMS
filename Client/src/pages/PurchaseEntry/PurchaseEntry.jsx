import React, { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

function PurchaseEntry() {
  const { fetchBrand, fetchCategory, fetchBrandData, categories } = useAuth();
  const navigate = useNavigate();
  const [addInput, setAddInput] = useState([
    {
      id: Date.now(),
      category: "",
      brand: "",
      rowLabel: "",
      colLabel: "",
      counter: 0,
      fetchData: [],
      brandData: [],
      colArray: [],
    },
  ]);

  const addNewList = (event) => {
    event.preventDefault();
    setAddInput((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        category: "",
        brand: "",
        rowLabel: "",
        colLabel: "",
        counter: 0,
        fetchData: [],
        brandData: [],
        colArray: [],
      },
    ]);
  };

  const handleDataInsert = async (itemId, field, value) => {
    const updatedData = addInput.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setAddInput(updatedData);

    // Handle category selection
    if (field === "category") {
      const catName = updatedData.find((item) => item.id === itemId)?.category;
      if (catName) {
        const fetchedData = await fetchBrandData(catName);
        setAddInput((prevData) =>
          prevData.map((item) =>
            item.id === itemId ? { ...item, fetchData: fetchedData } : item
          )
        );
      }
    }

    // Handle brand selection
    if (field === "brand") {
      const foundData = updatedData.find((item) => item.id === itemId);
      const brandData = foundData.fetchData.find(
        (data) => data.brandName === value
      );

      if (brandData) {
        const specificId = brandData._id;
        try {
          const response = await fetch("http://localhost:3000/api/getLabels", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ brandId: specificId }),
          });

          if (!response.ok) throw new Error("Failed to fetch labels");
          const data = await response.json();
          setAddInput((prevData) =>
            prevData.map((item) =>
              item.id === itemId ? { ...item, brandData: data } : item
            )
          );
        } catch (error) {
          console.error(error);
        }
      }
    }

    // Handle row label selection
    if (field === "rowLabel") {
      const foundData = updatedData.find((item) => item.id === itemId);
      const brndId = foundData.brandData?.type?.find(
        (data) => data.type === value
      )?.brandId;

      if (brndId) {
        try {
          const response = await fetch("http://localhost:3000/api/colData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rowLabel: value, brandId: brndId }),
          });
          if (!response.ok) throw new Error("Failed to fetch column data");
          const data = await response.json();

          // Update colArray with the fetched data
          setAddInput((prevData) =>
            prevData.map((item) =>
              item.id === itemId ? { ...item, colArray: data.msg } : item
            )
          );
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addInput }),
      });
      if (!response.ok) throw new Error("Error occurred while submitting");

      const data = await response.json();
      console.log(data);
      setAddInput([
        {
          id: Date.now(),
          category: "",
          brand: "",
          rowLabel: "",
          colLabel: "",
          counter: 0,
          fetchData: [],
          brandData: [],
          colArray: [],
        },
      ]);
      navigate("/purchases");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrement = (itemId) => {
    setAddInput((prev) => {
      const updatedList = prev.map((item) =>
        item.id === itemId
          ? // Math.max is used to determine upper and lower limit
            { ...item, counter: Math.max(0, item.counter - 1) }
          : item
      );
      return updatedList;
    });
  };

  const handleIncrement = (itemId) => {
    setAddInput((prev) => {
      const updatedList = prev.map((item) =>
        item.id === itemId ? { ...item, counter: item.counter + 1 } : item
      );
      return updatedList;
    });
  };

  const handleDelete = (itemId) => {
    setAddInput((prev) => prev.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return (
    <div id="newSales">
      <h2>Purchase Entry</h2>
      <section className="page-top-container">
        <div className="search-box">
          <i className="bx bx-search-alt"></i>
          <input
            type="text"
            placeholder="Search items to add..."
            aria-label="Search input"
          />
        </div>
        <div className="btn-container">
          <button onClick={addNewList} className="secondary-btn">
            + New Item
          </button>
        </div>
      </section>

      <section className="sales-item-container">
        <h5 className="imp-note">Note: Select the data in order</h5>
        <form onSubmit={handleSubmission}>
          <section className="sales-entry-items-list">
            {addInput.map((item) => (
              <div key={item.id} className="sales-entry-item">
                <i
                  onClick={() => handleDelete(item.id)}
                  className="bx bx-trash del-icon"
                ></i>
                <select
                  value={item.category}
                  onChange={(event) =>
                    handleDataInsert(item.id, "category", event.target.value)
                  }
                  className="cat-select"
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) &&
                    categories.map((category) => (
                      <option key={category._id} value={category.title}>
                        {category.title}
                      </option>
                    ))}
                </select>

                <select
                  value={item.brand}
                  onChange={(event) =>
                    handleDataInsert(item.id, "brand", event.target.value)
                  }
                  className="brand-select"
                >
                  <option value="">Select Brand</option>
                  {Array.isArray(item.fetchData) &&
                    item.fetchData.map((brand) => (
                      <option key={brand._id} value={brand.brandName}>
                        {brand.brandName}
                      </option>
                    ))}
                </select>

                <select
                  value={item.rowLabel}
                  onChange={(event) =>
                    handleDataInsert(item.id, "rowLabel", event.target.value)
                  }
                  className="row-select"
                >
                  <option value="">Select RowLabel</option>
                  {Array.isArray(item.brandData.type) &&
                    item.brandData.type.map((label) => (
                      <option key={label._id} value={label.type}>
                        {label.type}
                      </option>
                    ))}
                </select>

                <select
                  value={item.colLabel}
                  onChange={(event) =>
                    handleDataInsert(item.id, "colLabel", event.target.value)
                  }
                  className="column-select"
                >
                  <option value="">Select ColLabel</option>
                  {item.colArray.length > 0
                    ? Array.isArray(item.colArray) &&
                      item.colArray.map((label, index) => (
                        <option key={index} value={label}>
                          {label}
                        </option>
                      ))
                    : Array.isArray(item.brandData.column) &&
                      item.brandData.column.map((label) => (
                        <option key={label._id} value={label.column}>
                          {label.column}
                        </option>
                      ))}
                </select>

                <div className="sales-entry-qty">
                  <i
                    onClick={() => handleDecrement(item.id)}
                    className="bx bxs-minus-circle"
                  ></i>
                  <input type="number" value={item.counter} readOnly />
                  <i
                    onClick={() => handleIncrement(item.id)}
                    className="bx bxs-plus-circle"
                  ></i>
                </div>
              </div>
            ))}
          </section>
          <div className="btn-container new-entry-btn-container">
            <Link to="/sales">
              <button className="cancel-btn">Back</button>
            </Link>
            <button type="submit" className="primary-btn">
              Add
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PurchaseEntry;
