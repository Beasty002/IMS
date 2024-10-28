import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { toast, ToastContainer } from "react-toastify";

export default function CustomizeSingleCol({
  isOpen,
  onClose,
  specificId,
  selectedKey,
  fetchSingleVarData,
  codeDropDown
}) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [formData, setFormData] = useState([
    {
      id: Date.now(),
      columnName: "",
      specificId: "",
      isEditing: false,
      typeName: "",
      isNew: true,
    },
  ]);

  useEffect(()=>{
    console.log("CodeDropDown yo ho hai", codeDropDown);
  },[codeDropDown])

  useEffect(() => {
    if (fetchSingleVarData) {
      console.log("SIngle data yo ho", fetchSingleVarData);
    }
  }, [fetchSingleVarData]);

  const [brandLabelData, setBrandLabelData] = useState();

  useEffect(() => {
    if (specificId && selectedKey) {
      setFormData((prevFormData) =>
        prevFormData.map((item) => ({
          ...item,
          specificId: specificId,
          typeName: selectedKey,
        }))
      );
    }
  }, [specificId, selectedKey]);

  const handleInputChange = (event, id) => {
    const { name, value } = event.target;
    setFormData((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const handleInputAddition = (event) => {
    event.preventDefault();
    setFormData((prevState) => [
      ...prevState,
      {
        id: Date.now() + Math.random(),
        columnName: "",
        specificId: specificId,
        isEditing: true,
        isNew: true,
        typeName: selectedKey,
      },
    ]);
  };

  // const handleDeleteColumn = async (id, brandId) => {
  //   setFormData((prevState) => prevState.filter((item) => item.id !== id));
  //   try {
  //     const response = await fetch("http://localhost:3000/api/column", {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ columnId: id, brandId: brandId }),
  //     });
  //     const data = await response.json();

  //     if (!response.ok) {
  //       console.log(response.statusText);
  //       return;
  //     }

  //     console.log(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchColumnData = async (event) => {
    event.preventDefault();
    console.log(formData);

    try {
      const response = await fetch("http://localhost:3000/api/column", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(response.status);
        return;
      }

      console.log(data);
      toast.success(`New column created successfully`, {
        autoClose: 1000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1300);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchLabelData = async () => {
  //   if (specificId) {
  //     console.log(
  //       JSON.stringify({ brandId: specificId, selectedKey: selectedKey })
  //     );
  //     try {
  //       const response = await fetch("http://localhost:3000/api/getSpeCol", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           brandId: specificId,
  //           selectedKey: selectedKey,
  //         }),
  //       });

  //       const data = await response.json();
  //       if (!response.ok) {
  //         console.log(response.statusText);
  //         return;
  //       }
  //       console.log("Data is fucking", data);
  //       setBrandLabelData(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (specificId && selectedKey) {
  //     fetchLabelData();
  //   }
  // }, [specificId, selectedKey]);

  const fetchColUpdateData = async (id, brandId, columnName) => {
    console.log(JSON.stringify({ id, brandId, columnName }));
    try {
      const response = await fetch("http://localhost:3000/api/column", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, brandId, columnName }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Failed to update column", {
          autoClose: 1000,
        });
        return;
      }
      toast.success("Column updated successfully", {
        autoClose: 1000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1300);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   if (brandLabelData && brandLabelData.column) {
  //     const updatedFormData = brandLabelData.column.map((item) => ({
  //       id: item._id,
  //       columnName: item.column,
  //       specificId: specificId,
  //       isEditing: false,
  //     }));
  //     setFormData(updatedFormData);
  //   }
  // }, [brandLabelData, specificId]);

  useEffect(() => {
    if (fetchSingleVarData && fetchSingleVarData.msg) {
      const updatedFormData = fetchSingleVarData.msg.map((item) => ({
        id: item._id,
        columnName: item.column,
        specificId: item.brandId,
        typeId: item.typeId,
        isEditing: false,
        isNew: false,
      }));
      setFormData(updatedFormData);
    }
  }, [fetchSingleVarData]);

  const toggleEditMode = (id) => {
    setFormData((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section className="customize-col-popup">
        <h2>Customize Single Var Columns</h2>
        <form>
          {formData?.map((item) => (
            <div key={item.id} className="edit-box-container">
              <div className="edit-col-box">
                <input
                  type="text"
                  name="columnName"
                  placeholder="Enter a column name"
                  value={item.columnName}
                  onChange={(event) => handleInputChange(event, item.id)}
                  disabled={!item.isEditing && !item.isNew}
                />
                <div className="action-edit-col">
                  {!item.isNew && (
                    <>
                      {item.isEditing ? (
                        <button
                          className="edit-input"
                          onClick={() => {
                            fetchColUpdateData(
                              item.id,
                              specificId,
                              item.columnName
                            );
                            toggleEditMode(item.id);
                          }}
                        >
                          Save
                        </button>
                      ) : (
                        <i
                          className="bx bxs-edit-alt edit-icon"
                          onClick={() => {
                            toggleEditMode(item.id)
                            setEnableEdit(!enableEdit)
                          }}
                        ></i>
                      )}
                    </>
                  )}

                  {/* <i
                    className="bx bx-trash del-icon"
                    onClick={() => handleDeleteColumn(item.id, item.specificId)}
                  ></i> */}
                </div>
              </div>
            </div>
          ))}

          <div className="btn-container new-col-btn">
            <button onClick={handleInputAddition} className="secondary-btn">
              + New Column
            </button>
          </div>

          <div className="btn-container main-col-btn">
            <button
              type="button"
              onClick={fetchColumnData}
              className="save-btn"
              disabled={enableEdit ? true : false}
            >
              Save
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </section>
      <ToastContainer />
    </>,
    document.getElementById("overlay")
  );
}
