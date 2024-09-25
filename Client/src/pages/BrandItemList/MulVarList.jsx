import React from 'react'
import './MulVarList.css'

export default function MulVarList() {
    return (
        <>
            <section>
                <h1>Mayur Plywoods</h1>
                <section className="brand-list-top">
                    <div className="search-box">
                        <i className="bx bx-search-alt"></i>
                        <input
                            type="text"
                            placeholder="Search items..."
                            aria-label="Search input"
                        />
                    </div>
                    <div className="btn-container">
                        <button className="secondary-btn">
                            <i className="bx bx-filter-alt"></i>
                            Customize Columns
                        </button>
                        <button className="primary-btn">
                            <i className="bx bx-plus-circle"></i> New Brand
                        </button>
                    </div>
                </section>
            </section>

            <section>
                <div className="brand-item-table">
                    <table>
                        <thead>
                            <tr>
                                <th className='table-checkbox'><input type="checkbox" /></th>
                                <th>Size/mm</th>
                                <th>6mm</th>
                                <th>10mm</th>
                                <th>16mm</th>
                                <th className='table-action-container'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td className='table-checkbox'>
                                    <input type="checkbox" />
                                </td>
                                <td>1000</td>
                                <td>1000</td>
                                <td>12</td>
                                <td>12</td>
                                <td className='table-action-container'>
                                    <div className="action-container">
                                        <i className="bx bx-edit-alt edit-icon"></i>
                                        <i className="bx bx-trash del-icon"></i>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </section>
        </>
    )
}