import React from 'react'
import ReactDOM from 'react-dom'
import './DelPop.css'


export default function DelPop({ isOpen, onClose, children }) {

    return ReactDOM.createPortal(
        <>
            <div className="overlay"></div>
            <div className='del-popup'>
                <i className='bx bxs-trash'></i>
                <p className='del-msg'> Are you sure you want to delete <span className='del-item-name'>Mayur Doors</span> ? </p>
                <div className="btn-container">
                    <button className='cancel-btn'>Cancel</button>
                    <button className="del-btn">Delete</button>
                </div>
            </div>
        </>
        , document.getElementById('overlay')
    )
}
