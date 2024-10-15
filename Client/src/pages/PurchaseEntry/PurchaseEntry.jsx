import React, { useEffect, useState } from "react";
import { useAuth } from "../../customHooks/useAuth";
import { Link } from "react-router-dom";

function PurchaseEntry() {
  const { fetchBrand, fetchCategory, fetchBrandData, categories } = useAuth();
  const [colArray, setColArray] = useState([]);
  const [brandId, setBrandId] = useState(null);
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
        // direvlty return garya value instead of using previous state to get late data
        const fetchedData = await fetchBrandData(catName);

        console.log("Fetched brand data:", fetchedData);

        setAddInput((prevData) =>
          prevData.map((item) =>
            item.id === itemId ? { ...item, fetchData: fetchedData } : item
          )
        );
      }
    } else if (field === "brand") {
      const brandId = addInput.map(
        (item) => item.fetchData?.find((data) => data.brandName === value)?._id
      );
      console.log(brandId);
      if (brandId) {
        const specificId = brandId[0];
        setBrandId(specificId);
        console.log(specificId);
        try {
          const response = await fetch("http://localhost:3000/api/getLabels", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ brandId: specificId }),
          });

          const data = await response.json();
          if (!response.ok) {
            console.log("Error occured");
            return;
          }

          setAddInput((prevData) =>
            prevData.map((item) =>
              item.id === itemId ? { ...item, brandData: data } : item
            )
          );
        } catch (error) {
          console.error(error);
        }
      }
    } else if (field === "rowLabel") {
      console.log("addInput data: ", addInput);

      // just skip the complicated object entries cuz yele key value pair banaunthyuo
      // jasle garxa extract garna ko lagi extra key value mapping garna parthyo
      //  so vanam kinda shortcut
      const brndId = addInput.map(
        (item) =>
          item.brandData?.type?.find((data) => data.type === value)?.brandId
      );

      try {
        console.log(JSON.stringify({ rowLabel: value, brandId: brndId }));
        const response = await fetch("http://localhost:3000/api/colData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rowLabel: value, brandId: brndId }),
        });
        const data = await response.json();

        if (!response.ok) {
          console.log(response.statusText);
          return;
        }
        console.log(data);
        setColArray(data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (colArray) {
      console.log(colArray);
    }
  }, [colArray]);

  const handleSubmission = async (event) => {
    event.preventDefault();
    // console.log(JSON.stringify({ addInput, brandId: brandId }));
    try {
      const response = await fetch("http://localhost:3000/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addInput }),
      });

      const data = await response.json();
      if (response.ok) {
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
          },
        ]);
      } else {
        console.log("Error");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

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
    console.log(addInput);
  }, [addInput]);

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
                  {Array.isArray(colArray) &&
                    colArray.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
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
