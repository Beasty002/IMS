import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./DelPop.css";
import { ToastContainer, toast } from "react-toastify";

export default function DelPop({
  isOpen,
  onClose,
  specificId,
  selectedKey,
  delBrandName,
  codeDropDown,
  type,
}) {
  // useEffect(() => {
  //   console.log(delBrandName);
  // }, [delBrandName]);

  let typeId;
  let body;

  const handleBrandDeletion = async () => {
    if (type == "type") {
      const typeIdArray = codeDropDown.find(
        (item) => item.type === selectedKey
      );
      typeId = typeIdArray._id;
      body = {
        delTypeId: typeId,
      };
    } else {
      body = {
        delBrandId: specificId,
      };
    }
    console.log(JSON.stringify(body));

    try {
      const response = await fetch(`http://localhost:3000/api/${type}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      toast.success(`${type} deleted successfully`, {
        autoClose: 1000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1300);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <div className="del-popup">
        <i className="bx bxs-trash"></i>
        <p className="del-msg">
          {" "}
          Are you sure you want to{" "}
          <span className="del-item-name">
            {delBrandName || selectedKey}
          </span> ?{" "}
        </p>
        <div className="btn-container">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleBrandDeletion} className="del-btn">
            Delete
          </button>
        </div>
      </div>
      <ToastContainer />
    </>,
    document.getElementById("overlay")
  );
}
