import React from "react";
import ReactDOM from "react-dom";
import "./AddCat.css";

function AddCat({ isOpen, onClose, children }) {
  return ReactDOM.createPortal(<>
    <div>
        
    </div>
  </>, 
  document.getElementById("overlay"));
}

export default AddCat;
