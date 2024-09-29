import React from 'react'
import './DelPop.css'

export default function DelPoppp() {
    return (
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

    )
}
