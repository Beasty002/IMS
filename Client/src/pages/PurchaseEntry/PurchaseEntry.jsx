import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../customHooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function PurchaseEntry() {
  const { fetchBrand, fetchCategory, fetchBrandData, categories } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [resData, setResData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
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

  const incrementTimer = useRef(null);
  const decrementTimer = useRef(null);

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
      toast.success("Successfully bought stock", {
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate("/purchases");
      }, 1300);
    } catch (error) {
      console.error(error);
      toast.error("Unexpected Error occured");
    } finally {
      checkForNewDate();
    }
  };
  const checkForNewDate = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reportStock", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrement = (itemId) => {
    setAddInput((prev) => {
      const updatedList = prev.map((item) =>
        item.id === itemId
          ? { ...item, counter: Math.max(0, item.counter - 1) }
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

  const handleLongPressIncrement = (itemId) => {
    incrementTimer.current = setInterval(() => handleIncrement(itemId), 200);
  };

  const handleLongPressEnd = () => {
    clearInterval(incrementTimer.current);
  };

  const handleLongPressDecrement = (itemId) => {
    decrementTimer.current = setInterval(() => handleDecrement(itemId), 200);
  };

  const handleLongPressEndDecrement = () => {
    clearInterval(decrementTimer.current);
  };

  const handleDelete = (itemId) => {
    setAddInput((prev) => prev.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const changeValue = (itemId, value) => {
    const numericValue = parseInt(value, 10);
    setAddInput((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, counter: numericValue } : item
      )
    );
  };

  const searchInputValue = async (currentValue) => {
    console.log(JSON.stringify({ searchedItem: currentValue }));

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/searchItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchedItem: currentValue }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      setResData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTheData = (data) => {
    const parts = data.split(" ");
    const category = parts.length > 1 ? parts[1] : "";
    const brand = parts.length > 0 ? parts[0] : "";
    const rowLabel = parts.length > 2 ? parts[2] : "";
    const str = parts.at(-1).replace(/[()]/g, "");
    console.log(str);

    const newInput = {
      id: Date.now(),
      category: category,
      brand: brand,
      rowLabel: rowLabel,
      colLabel: str,
      counter: 0,
      fetchData: [],
      brandData: [],
      colArray: [],
    };

    setAddInput((prevInputs) => [...prevInputs, newInput]);
    setResData([]);

    console.log(category);
    console.log(brand);
    console.log(rowLabel);
    console.log(str);
  };

  return (
    <div id="newSales">
      <h2>Purchase Entry</h2>
      <section className="page-top-container extra">
        <div className="search-box" ref={searchContainerRef}>
          <div className="search">
            <i className="bx bx-search-alt"></i>
            <input
              type="text"
              placeholder="Search items to add..."
              aria-label="Search input"
              value={searchValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                const newValue = e.target.value;
                setSearchValue(newValue);
                searchInputValue(newValue);
              }}
            />
          </div>
          {showSuggestions && (
            <div className="search-list">
              {isLoading ? (
                <p>Data is loading...</p>
              ) : (
                <ul>
                  {resData?.map((item, index) => (
                    <li
                      onClick={() => {
                        getTheData(item);
                        setSearchValue("");
                      }}
                      key={index}
                    >
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
                  value={item.brand || ""}
                  onChange={(event) =>
                    handleDataInsert(item.id, "brand", event.target.value)
                  }
                  className="brand-select"
                >
                  <option value="">Select Brand</option>
                  {Array.isArray(item.fetchData) &&
                  item.fetchData.length > 0 ? (
                    item.fetchData.map((brand) => (
                      <option key={brand._id} value={brand.brandName}>
                        {brand.brandName}
                      </option>
                    ))
                  ) : (
                    <option value={item.brand}>{item.brand}</option>
                  )}
                </select>

                <select
                  value={item.rowLabel}
                  onChange={(event) =>
                    handleDataInsert(item.id, "rowLabel", event.target.value)
                  }
                  className="row-select"
                >
                  <option value="">Select RowLabel</option>
                  {Array.isArray(item.brandData?.type) &&
                  item.brandData.type.length > 0 ? (
                    item.brandData.type.map((label) => (
                      <option key={label._id} value={label.type}>
                        {label.type}
                      </option>
                    ))
                  ) : (
                    <option value={item.rowLabel}>{item.rowLabel}</option>
                  )}
                </select>

                <select
                  value={item.colLabel}
                  onChange={(event) =>
                    handleDataInsert(item.id, "colLabel", event.target.value)
                  }
                  className="column-select"
                >
                  <option value="">Select ColLabel</option>
                  {Array.isArray(item.colArray) && item.colArray.length > 0 ? (
                    item.colArray.map((label, index) => (
                      <option key={index} value={label}>
                        {label}
                      </option>
                    ))
                  ) : Array.isArray(item.brandData?.column) &&
                    item.brandData.column.length > 0 ? (
                    item.brandData.column.map((label) => (
                      <option key={label._id} value={label.column}>
                        {label.column}
                      </option>
                    ))
                  ) : (
                    <option value={item.colLabel}>{item.colLabel}</option>
                  )}
                </select>

                <div className="sales-entry-qty">
                  <i
                    onClick={() => handleDecrement(item.id)}
                    onMouseDown={() => handleLongPressDecrement(item.id)}
                    onMouseUp={handleLongPressEndDecrement}
                    onMouseLeave={handleLongPressEndDecrement}
                    className="bx bxs-minus-circle"
                  ></i>
                  <input
                    type="number"
                    value={item.counter}
                    onChange={(event) =>
                      changeValue(item.id, event.target.value)
                    }
                  />
                  <i
                    onClick={() => handleIncrement(item.id)}
                    onMouseDown={() => handleLongPressIncrement(item.id)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
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
      <ToastContainer />
    </div>
  );
}

export default PurchaseEntry;
