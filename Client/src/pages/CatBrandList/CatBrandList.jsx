import React from 'react'
import './CatBrandList.css'

export default function CatBrandList() {
    return (
        <section>
            <h1>Plywood Brands</h1>
            <div className="brand-list-top">
                <div className="search-box">
                    <i className='bx bx-search-alt'></i>
                    <input
                        type="text"
                        placeholder="Search brands..."
                        aria-label="Search input"
                    />
                </div>
                <div className="btn-container">
                    <button className="primary-btn"><i className='bx bx-plus-circle' ></i> New Brand</button>
                </div>


            </div>
            <div className="brand-list">
                <div className="brand-box">
                    <h3>Mayur Plywoods</h3>
                    <p className="brand-stock-availability">Stock available : 80</p>
                    <div className="action-container">
                        <i className='bx bx-edit-alt edit-icon' ></i>
                        <i class='bx bx-trash del-icon' ></i>
                    </div>
                </div>
            </div>
        </section>
    )
}
