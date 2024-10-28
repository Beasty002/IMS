import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Rename.css";

function Rename({ isOpen, onClose, selectedKey, codeDropDown }) {
  useEffect(() => {
    console.log("This is selected Key", selectedKey);
  }, [selectedKey]);

  const [renameInput, setRenameInput] = useState("");

  const renameType = async () => {
    try {
      const typeIdArray = codeDropDown.find(
        (item) => item.type === selectedKey
      );
      const typeId = typeIdArray._id;
      // console.log("YO ho hai typeId", typeId);
      console.log(JSON.stringify({ newName: renameInput, typeId: typeId }));
      const response = await fetch("http://localhost:3000/api/type", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newName: renameInput, typeId: typeId }),
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

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div onClick={onClose} className="overlay"></div>
      <section className="rename-pop">
        <h2>Rename {selectedKey}</h2>
        <div className="form-container">
          <label>Enter a new name for {selectedKey}</label>
          <input
            value={renameInput}
            onChange={(event) => setRenameInput(event.target.value)}
            type="text"
            placeholder="Enter a new name"
            required
          />
        </div>
        <div className="btn-container">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={renameType} className="primary-btn">
            Rename
          </button>
        </div>
      </section>
    </>,
    document.getElementById("overlay")
  );
}

export default Rename;
